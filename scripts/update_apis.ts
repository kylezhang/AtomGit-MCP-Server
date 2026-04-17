
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../docs/apis_url.json');

const SITEMAP_URL = 'https://docs.atomgit.com/sitemap.xml';
const CONCURRENCY = 10;
const DOCS_HOST = 'docs.atomgit.com';
const IGNORED_DOC_URLS = new Set([
  // OAuth authorization flow docs are not modeled as MCP API tools.
  'https://docs.atomgit.com/docs/apis/get-oauth-authorize-client-id-client-id-redirect-uri-redirect-uri-response-type-code-scope-scope-state-state',
  'https://docs.atomgit.com/docs/apis/post-oauth-token-grant-type-authorization-code-code-code-client-id-client-id-client-secret-client-secret',
  'https://docs.atomgit.com/docs/apis/oauth',
  // Legacy duplicate pages kept by the docs site. The `-new` variants are the canonical ones.
  'https://docs.atomgit.com/docs/apis/delete-api-v-5-org-owner-kanban-kanban-id-remove-item',
  'https://docs.atomgit.com/docs/apis/put-api-v-5-org-owner-kanban-repo-repo-type-iid'
]);

interface ApiEndpoint {
  name: string;
  httpMethod: string;
  endpointPath: string;
  documentationUrl: string;
}

interface Category {
  name: string;
  endpointCount: number;
  endpoints: ApiEndpoint[];
}

interface CategorizedEndpoint {
  category: string;
  endpoint: ApiEndpoint;
}

async function fetchUrl(url: string, retries = 3): Promise<string | null> {
  const normalizedUrl = normalizeDocumentationUrl(url);
  try {
    const response = await axios.get(normalizedUrl, { timeout: 10000 });
    return response.data;
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return fetchUrl(normalizedUrl, retries - 1);
    }
    console.error(`Failed to fetch ${normalizedUrl}:`, error.message);
    return null;
  }
}

function normalizeDocumentationUrl(url: string): string {
  try {
    const normalized = new URL(url);
    normalized.hostname = DOCS_HOST;
    return normalized.toString();
  } catch {
    return url;
  }
}

function normalizeEndpointPath(pathValue: string): string {
  let endpointPath = pathValue.trim();
  if (!endpointPath) {
    return 'Unknown';
  }

  if (endpointPath.startsWith('http://') || endpointPath.startsWith('https://')) {
    try {
      endpointPath = new URL(endpointPath).pathname;
    } catch {
      return 'Unknown';
    }
  }

  if (!endpointPath.startsWith('/')) {
    endpointPath = `/${endpointPath}`;
  }

  return endpointPath.replace(/\s+/g, '');
}

function scoreEndpoint(endpoint: ApiEndpoint): number {
  let score = 0;
  if (endpoint.endpointPath !== 'Unknown') score += 4;
  if (!/%[0-9A-Fa-f]{2}/.test(endpoint.documentationUrl)) score += 2;
  if (!endpoint.documentationUrl.includes('-new')) score += 1;
  return score;
}

function getCanonicalEndpointKey(endpoint: ApiEndpoint): string {
  if (endpoint.endpointPath !== 'Unknown') {
    return `${endpoint.httpMethod}:${normalizeEndpointPath(endpoint.endpointPath).replace(/:[a-zA-Z0-9_]+/g, ':var')}`;
  }
  return `${endpoint.httpMethod}:NAME:${endpoint.name}`;
}

function scoreCategorizedEndpoint(entry: CategorizedEndpoint): number {
  let score = scoreEndpoint(entry.endpoint);
  if (entry.category !== 'Uncategorized') {
    score += 3;
  }
  return score;
}

function dedupeCategorizedEndpoints(entries: CategorizedEndpoint[]): CategorizedEndpoint[] {
  const deduped = new Map<string, CategorizedEndpoint>();

  for (const entry of entries) {
    const key = getCanonicalEndpointKey(entry.endpoint);
    const existing = deduped.get(key);

    if (!existing || scoreCategorizedEndpoint(entry) > scoreCategorizedEndpoint(existing)) {
      deduped.set(key, entry);
    }
  }

  return Array.from(deduped.values()).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category, 'zh-CN');
    if (a.endpoint.httpMethod !== b.endpoint.httpMethod) return a.endpoint.httpMethod.localeCompare(b.endpoint.httpMethod);
    return a.endpoint.name.localeCompare(b.endpoint.name, 'zh-CN');
  });
}

async function parsePage(url: string, html: string): Promise<{ category: string, endpoint: ApiEndpoint } | null> {
  if (IGNORED_DOC_URLS.has(url)) return null;

  const $ = cheerio.load(html);
  
  const title = $('h1').first().text().trim();
  if (!title) return null;

  // Breadcrumbs: " > Category > Title"
  let category = 'Uncategorized';
  const breadcrumbs: string[] = [];
  $('.breadcrumbs__item').each((i, el) => {
      breadcrumbs.push($(el).text().trim());
  });
  
  // Example: ["", "Repositories", "Get Tree"]
  // Or: ["Docs", "APIs", "Repositories", "Get Tree"]
  if (breadcrumbs.length >= 2) {
      const clean = breadcrumbs.filter(b => b && b.trim() !== '>' && b !== 'Home');
      // If the last one is title, the one before is category
      if (clean.length > 1) {
          category = clean[clean.length - 2];
      }
  }

  // Method
  let method = $('.badge').first().text().trim();
  if (!method) {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      $('span, div, p').each((i, el) => {
          const txt = $(el).text().trim().toUpperCase();
          if (methods.includes(txt)) {
              method = txt;
              return false;
          }
      });
  }
  if (!method) method = 'Unknown';

  // Path
  let endpointPath = normalizeEndpointPath($('.openapi__method-endpoint-path').first().text());

  if (endpointPath === 'Unknown') {
    const pathRegex = /(?:\/|https:\/\/api\.[^\/]+\/)api\/v(?:1|5|8)\/[a-zA-Z0-9\-\_\.\/\{\}\:]+/g;
    const matches = html.match(pathRegex);

    if (matches) {
      const paths = matches.filter((m: string) => m.length > 10 && !m.endsWith('api/v5'));
      if (paths.length > 0) {
        endpointPath = normalizeEndpointPath(paths[0]);
      }
    }
  }

  return {
      category,
      endpoint: {
          name: title,
          httpMethod: method,
          endpointPath,
          documentationUrl: normalizeDocumentationUrl(url)
      }
  };
}

async function main() {
  console.log('Fetching sitemap...');
  const sitemapXml = await fetchUrl(SITEMAP_URL);
  if (!sitemapXml) return;

  // Extract URLs
  const urlRegex = /<loc>(https:\/\/docs\.[^\/]+\/docs\/apis\/[^<]+)<\/loc>/g;
  const urls: string[] = [];
  let match;
  while ((match = urlRegex.exec(sitemapXml)) !== null) {
      const u = normalizeDocumentationUrl(match[1]);
      if (u !== 'https://docs.atomgit.com/docs/apis/' && !IGNORED_DOC_URLS.has(u)) {
        urls.push(u);
      }
  }

  console.log(`Found ${urls.length} API pages.`);

  const categorizedEndpoints: CategorizedEndpoint[] = [];
  let processed = 0;

  // Process in chunks
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
      const chunk = urls.slice(i, i + CONCURRENCY);
      const results = await Promise.all(chunk.map(async (url) => {
          const html = await fetchUrl(url);
          if (!html) return null;
          return parsePage(url, html);
      }));

      for (const res of results) {
          if (res) {
              categorizedEndpoints.push({
                  category: res.category,
                  endpoint: res.endpoint
              });
          }
      }
      processed += chunk.length;
      process.stdout.write(`\rProcessed ${processed}/${urls.length}`);
  }
  console.log('\nProcessing complete.');

  // Sort and build JSON
  const categories: Category[] = [];
  let totalEndpoints = 0;

  const dedupedEntries = dedupeCategorizedEndpoints(categorizedEndpoints);
  const categoriesMap = new Map<string, ApiEndpoint[]>();

  for (const entry of dedupedEntries) {
      if (entry.endpoint.httpMethod === 'Unknown' && entry.endpoint.endpointPath === 'Unknown') {
          continue;
      }
      if (!categoriesMap.has(entry.category)) {
          categoriesMap.set(entry.category, []);
      }
      categoriesMap.get(entry.category)!.push(entry.endpoint);
  }

  const sortedKeys = Array.from(categoriesMap.keys()).sort();

  for (const key of sortedKeys) {
      const endpoints = categoriesMap.get(key)!;
      categories.push({
          name: key,
          endpointCount: endpoints.length,
          endpoints
      });
      totalEndpoints += endpoints.length;
  }

  const output = {
      totalEndpoints,
      categories
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Updated ${OUTPUT_FILE}`);
}

main();
