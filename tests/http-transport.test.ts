import { spawn, type ChildProcess } from 'node:child_process';
import { resolve } from 'node:path';

// jest runs from the project root.
const PROJECT_ROOT = resolve(process.cwd());
const TSX_BIN = resolve(PROJECT_ROOT, 'node_modules', '.bin', 'tsx');
const ENTRY = resolve(PROJECT_ROOT, 'src', 'index.ts');

function waitForServer(child: ChildProcess, port: number, timeoutMs = 15000): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Server did not start listening on port ${port} in time`));
    }, timeoutMs);

    const onData = (chunk: Buffer) => {
      const text = chunk.toString();
      if (text.includes('AtomGit MCP Server running on http://')) {
        clearTimeout(timer);
        resolvePromise();
      }
    };
    child.stderr?.on('data', onData);
    child.once('exit', () => {
      clearTimeout(timer);
      reject(new Error('Server exited before startup completed'));
    });
  });
}

function waitForExit(child: ChildProcess, timeoutMs = 10000): Promise<number | null> {
  return new Promise((resolvePromise) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolvePromise(null);
    }, timeoutMs);

    child.once('exit', (code) => {
      clearTimeout(timer);
      resolvePromise(code);
    });
  });
}

describe('HTTP transport (ATOMGIT_TRANSPORT=http)', () => {
  let child: ChildProcess;
  let port: number;

  beforeAll(async () => {
    // Use a high random port to avoid collisions with other tests/services.
    port = 31000 + Math.floor(Math.random() * 2000);

    child = spawn(process.execPath, [TSX_BIN, ENTRY], {
      cwd: PROJECT_ROOT,
      env: {
        ...process.env,
        ATOMGIT_TRANSPORT: 'http',
        ATOMGIT_HOST: '127.0.0.1',
        ATOMGIT_PORT: String(port),
        ATOMGIT_TOKEN: 'test-token',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    await waitForServer(child, port);
  }, 20000);

  afterAll(async () => {
    if (child && child.exitCode === null) {
      child.kill('SIGTERM');
      await waitForExit(child);
    }
  });

  it('listens and serves the /mcp endpoint with CORS headers', async () => {
    // GET without initialization: the SDK should reject (400/405) but the route
    // must be handled (i.e. not a 404), and CORS headers must be present.
    const res = await fetch(`http://127.0.0.1:${port}/mcp`);
    expect(res.status).not.toBe(404);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(res.headers.get('access-control-allow-methods')).toContain('POST');
  });

  it('answers CORS preflight OPTIONS requests', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/mcp`, { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(res.headers.get('access-control-allow-methods')).toContain('OPTIONS');
  });

  it('returns 404 for unknown paths', async () => {
    const res = await fetch(`http://127.0.0.1:${port}/nope`);
    expect(res.status).toBe(404);
  });

  it('exits gracefully on SIGTERM', async () => {
    const exitPromise = waitForExit(child);
    child.kill('SIGTERM');
    const code = await exitPromise;
    expect(code).toBe(0);
  });
});
