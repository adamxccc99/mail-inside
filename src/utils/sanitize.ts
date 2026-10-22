import DOMPurify from 'dompurify';

export function sanitizeEmailHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  const clean = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3',
      'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 'span',
      'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul', 'font', 'center'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'align', 'valign',
      'bgcolor', 'color', 'border', 'cellpadding', 'cellspacing', 'style'
    ],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    ALLOW_DATA_ATTR: false
  });

  // Ensure all links open safely in a new tab with noopener
  if (typeof document !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(clean, 'text/html');
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer nofollow');
    });

    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('referrerpolicy', 'no-referrer');
      img.setAttribute('loading', 'lazy');
      // Style to prevent horizontal overflow in readers
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    });

    return doc.body.innerHTML;
  }

  return clean;
}
