/**
 * Structured domain telemetry logging.
 * Built into all feature operations, emitting JSON logs to stdout for hosting log viewers.
 */

export type DomainEventType =
  | 'order.created'
  | 'order.shipped'
  | 'commission.submitted'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'portfolio.created'
  | 'portfolio.updated'
  | 'portfolio.deleted'
  | 'snapshot.exported'
  | 'snapshot.restored';

export interface DomainEventLog<T = unknown> {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  event: DomainEventType;
  payload: T;
  correlationId: string;
}

/**
 * Generate a lightweight random correlation ID if none is supplied.
 */
export function generateCorrelationId(): string {
  return `cid-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Emits a single structured JSON line to stdout.
 */
export function logDomainEvent<T = unknown>(
  event: DomainEventType,
  payload: T,
  correlationId?: string
): DomainEventLog<T> {
  const logEntry: DomainEventLog<T> = {
    timestamp: new Date().toISOString(),
    level: 'info',
    event,
    payload,
    correlationId: correlationId || generateCorrelationId(),
  };

  // Structured single-line JSON output for Vercel / serverless log aggregation
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(logEntry));

  return logEntry;
}
