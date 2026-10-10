import { AxiosHeaders, isAxiosError } from 'axios';

// Covers AtomGit's auth header spelling variants and Actions' access_token query param.
const SENSITIVE_KEY_PATTERN =
  /^(authorization|proxy-authorization|private-token|token|access[-_]?token|api[-_]?key|x-api-key|cookie|set-cookie)$/i;

const REDACTED = '***';

export function redactSensitiveEntries(source: unknown): Record<string, unknown> | undefined {
  if (source === null || typeof source !== 'object') {
    return undefined;
  }
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    redacted[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : value;
  }
  return redacted;
}

export function sanitizeAxiosError(error: unknown): void {
  if (!isAxiosError(error)) {
    return;
  }
  for (const config of [error.config, error.response?.config]) {
    if (!config) {
      continue;
    }
    const headers = redactSensitiveEntries(config.headers);
    if (headers) {
      config.headers = headers as unknown as AxiosHeaders;
    }
    const params = redactSensitiveEntries(config.params);
    if (params) {
      config.params = params;
    }
  }
  // Node's ClientRequest carries `_header` — the raw serialized request headers with credentials.
  delete error.request;
  if (error.response) {
    delete error.response.request;
    const responseHeaders = redactSensitiveEntries(error.response.headers);
    if (responseHeaders) {
      error.response.headers = responseHeaders as unknown as typeof error.response.headers;
    }
  }
}

export function errorToSafeLogValue(error: unknown): unknown {
  if (isAxiosError(error)) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      method: error.config?.method,
      url: error.config?.url,
      headers: redactSensitiveEntries(error.config?.headers),
      params: redactSensitiveEntries(error.config?.params),
      responseStatus: error.response?.status,
      responseData: error.response?.data,
    };
  }
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return String(error);
}
