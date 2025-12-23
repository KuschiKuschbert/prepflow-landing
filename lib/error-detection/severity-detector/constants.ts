/**
 * Safety keywords - system security and data integrity issues
 */
export const SAFETY_KEYWORDS = [
  'unauthorized',
  'unauthorised',
  'authentication failed',
  'auth failed',
  'permission denied',
  'access denied',
  'forbidden',
  'security',
  'breach',
  'corruption',
  'corrupted',
  'data corruption',
  'integrity',
  'tamper',
  'malicious',
  'injection',
  'xss',
  'csrf',
  'sql injection',
  'hack',
  'exploit',
  'vulnerability',
];

/**
 * Critical keywords - system crashes, data loss, complete failures
 */
export const CRITICAL_KEYWORDS = [
  'database connection',
  'db connection',
  'connection failed',
  'connection error',
  'system crash',
  'crash',
  'data loss',
  'lost data',
  '500 error',
  'internal server error',
  'fatal',
  'cannot connect',
  'timeout',
  'out of memory',
  'memory error',
  'disk full',
  'service unavailable',
  '503',
];

/**
 * High keywords - major feature breakage, API failures
 */
export const HIGH_KEYWORDS = [
  'api failed',
  'api error',
  'endpoint failed',
  'request failed',
  'feature broken',
  'broken feature',
  '400 error',
  'bad request',
  'not found',
  '404',
  'method not allowed',
  '405',
];
