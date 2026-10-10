import { inspect } from 'node:util';
import { AxiosError, AxiosHeaders } from 'axios';
import {
  errorToSafeLogValue,
  redactSensitiveEntries,
  sanitizeAxiosError,
} from '../src/core/ErrorSanitizer.js';
import { BaseService } from '../src/services/BaseService.js';

const TOKEN = 'ag_pat_super-secret-token-value';

function buildAxiosError(): AxiosError {
  const headers = AxiosHeaders.from({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'PRIVATE-TOKEN': TOKEN,
    'token': TOKEN,
  });
  const config = {
    method: 'get',
    url: '/api/v5/repos/no/such-repo',
    headers,
    params: { access_token: TOKEN, page: 1 },
  };
  const response = {
    status: 404,
    statusText: 'Not Found',
    data: { message: 'Project not found' },
    headers: { 'set-cookie': `session=${TOKEN}`, 'content-type': 'application/json' },
    config,
    request: { _header: `PRIVATE-TOKEN: ${TOKEN}\r\n` },
  };
  return new AxiosError(
    'Request failed with status code 404',
    'ERR_BAD_REQUEST',
    config as never,
    { _header: `PRIVATE-TOKEN: ${TOKEN}\r\n` },
    response as never
  );
}

describe('redactSensitiveEntries', () => {
  it('masks credential keys case-insensitively and keeps the rest', () => {
    const result = redactSensitiveEntries({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
      'PRIVATE-TOKEN': TOKEN,
      'private-token': TOKEN,
      'token': TOKEN,
      'access_token': TOKEN,
      'accessToken': TOKEN,
      'X-Api-Key': TOKEN,
      'Cookie': 'session=abc',
    });
    expect(result).toEqual({
      'Content-Type': 'application/json',
      'Authorization': '***',
      'PRIVATE-TOKEN': '***',
      'private-token': '***',
      'token': '***',
      'access_token': '***',
      'accessToken': '***',
      'X-Api-Key': '***',
      'Cookie': '***',
    });
  });

  it('returns undefined for non-object input', () => {
    expect(redactSensitiveEntries(undefined)).toBeUndefined();
    expect(redactSensitiveEntries(null)).toBeUndefined();
    expect(redactSensitiveEntries('text')).toBeUndefined();
  });
});

describe('sanitizeAxiosError', () => {
  it('strips credentials from config, response.config and request objects', () => {
    const error = buildAxiosError();
    expect(inspect(error, { depth: null })).toContain(TOKEN);

    sanitizeAxiosError(error);

    const dumped = inspect(error, { depth: null });
    expect(dumped).not.toContain(TOKEN);
    expect(dumped).toContain('***');
    expect(error).toBeInstanceOf(AxiosError);
    expect(error.message).toBe('Request failed with status code 404');
    expect(error.code).toBe('ERR_BAD_REQUEST');
    expect(error.request).toBeUndefined();
    expect(error.response?.request).toBeUndefined();
    expect(error.response?.status).toBe(404);
    expect(error.response?.data).toEqual({ message: 'Project not found' });
    expect(error.response?.headers).toMatchObject({
      'set-cookie': '***',
      'content-type': 'application/json',
    });
    expect((error.config as unknown as { params: Record<string, unknown> }).params).toEqual({
      access_token: '***',
      page: 1,
    });
  });

  it('leaves non-axios errors untouched', () => {
    const error = new Error(`plain failure ${TOKEN}`);
    sanitizeAxiosError(error);
    expect(error.message).toBe(`plain failure ${TOKEN}`);
  });

  it('is idempotent', () => {
    const error = buildAxiosError();
    sanitizeAxiosError(error);
    sanitizeAxiosError(error);
    expect(inspect(error, { depth: null })).not.toContain(TOKEN);
  });
});

describe('errorToSafeLogValue', () => {
  it('summarizes axios errors without credentials but with debug context', () => {
    const error = buildAxiosError();
    const summary = errorToSafeLogValue(error);
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain(TOKEN);
    expect(serialized).toContain('***');
    expect(summary).toMatchObject({
      name: 'AxiosError',
      message: 'Request failed with status code 404',
      code: 'ERR_BAD_REQUEST',
      method: 'get',
      url: '/api/v5/repos/no/such-repo',
      responseStatus: 404,
      responseData: { message: 'Project not found' },
    });
    expect(inspect(summary, { depth: null })).not.toContain(TOKEN);
  });

  it('reduces plain errors to name/message/stack', () => {
    const error = new Error('boom');
    const summary = errorToSafeLogValue(error) as Record<string, unknown>;
    expect(summary.name).toBe('Error');
    expect(summary.message).toBe('boom');
    expect(typeof summary.stack).toBe('string');
  });

  it('stringifies non-error values', () => {
    expect(errorToSafeLogValue('failed')).toBe('failed');
    expect(errorToSafeLogValue(42)).toBe('42');
    expect(errorToSafeLogValue(null)).toBe('null');
  });
});

describe('BaseService error interceptor', () => {
  class TestService extends BaseService {
    get httpClient() {
      return this.client;
    }
  }

  it('sanitizes errors from real requests before they reach callers', async () => {
    const service = new TestService({
      apiBaseUrl: 'http://127.0.0.1:9/api',
      token: TOKEN,
      timeout: 2000,
    });

    const error: unknown = await service.httpClient
      .get('/repos/no/such-repo', { params: { access_token: TOKEN } })
      .then(
        () => null,
        (e) => e
      );

    expect(error).toBeInstanceOf(AxiosError);
    const dumped = inspect(error, { depth: null });
    expect(dumped).not.toContain(TOKEN);
    expect(dumped).toContain('***');
  });
});
