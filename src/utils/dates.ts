const DAY = 1000 * 60 * 60 * 24;

interface TimeParameters {
  start: number;
  end: number;
}

export interface Period {
  from: string;
  to: string;
}

export function getPeriod(days: number): Period {
  const now = Date.now();
  const end = now - (now % DAY) - DAY;
  const period = days * DAY;
  const start = end - period + DAY;

  const fromDate = new Date(start);
  const from = fromDate.toISOString();
  const toDate = new Date(end);
  const to = toDate.toISOString();

  return {
    from,
    to,
  };
}

export function getTimestampsFromPeriod(period: Period): TimeParameters {
  const from = new Date(period.from);
  const to = new Date(period.to);
  return {
    start: from.getTime() / 1000,
    end: to.getTime() / 1000,
  };
}

export function getResolutionByPeriod(period: Period): string {
  const from = new Date(period.from);
  const to = new Date(period.to);
  const diffTime = Math.abs(to.getTime() - from.getTime());
  const diffDays = Math.ceil(diffTime / DAY);
  if (diffDays < 60) {
    return '1d';
  }
  if (diffDays < 365) {
    return '1w';
  }
  return '30d';
}
