export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getDateKey(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatTimeLabel(startDateTime: string) {
  const start = new Date(startDateTime);
  if (Number.isNaN(start.getTime())) return 'Invalid time';
  return start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatAppointmentDateTime(startDateTime: string, endDateTime?: string | null) {
  const start = new Date(startDateTime);
  if (Number.isNaN(start.getTime())) return 'Date unavailable';

  const datePart = start.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timePart = formatTimeLabel(startDateTime);

  if (!endDateTime) return `${datePart} · ${timePart}`;

  const end = new Date(endDateTime);
  if (Number.isNaN(end.getTime())) return `${datePart} · ${timePart}`;

  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart} · ${timePart} – ${endTime}`;
}

export function safeDecodeParam(value: string | undefined, fallback = '') {
  if (!value) return fallback;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function resolveRouteParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
