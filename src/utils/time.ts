export interface DurationOption {
  hours: number;
  labelKey: string;
}

export const DURATION_OPTIONS: DurationOption[] = [
  { hours: 1, labelKey: 'duration_1h' },
  { hours: 2, labelKey: 'duration_2h' },
  { hours: 6, labelKey: 'duration_6h' },
  { hours: 12, labelKey: 'duration_12h' },
  { hours: 24, labelKey: 'duration_1d' },
  { hours: 48, labelKey: 'duration_2d' },
  { hours: 72, labelKey: 'duration_3d' },
  { hours: 120, labelKey: 'duration_5d' },
  { hours: 168, labelKey: 'duration_7d' },
];

export function getRemainingSeconds(expiresAt: number, now = Date.now()): number {
  const diffMs = expiresAt - now;
  return Math.max(0, Math.floor(diffMs / 1000));
}

export function formatCountdown(totalSeconds: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  displayString: string;
  isExpiringSoon: boolean;
} {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const hms = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const displayString = days > 0 ? `${days}d ${hms}` : hms;

  return {
    days,
    hours,
    minutes,
    seconds,
    displayString,
    isExpiringSoon: safeSeconds <= 600 && safeSeconds > 0 // <= 10 minutes
  };
}

export function formatDateTime(isoString: string | number, locale = 'en'): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch {
    return String(isoString);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
