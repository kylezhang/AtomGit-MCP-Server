
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, '../docs/apis_url.json');

const SITEMAP_URL = 'https://docs.gitcode.com/sitemap.xml';
const CONCURRENCY = 10;

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

async function fetchUrl(url: string, retries = 3): Promise<string | null> {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return fetchUrl(url, retries - 1);
    }
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

async function parsePage(url: string, html: string): Promise<{ category: string, endpoint: ApiEndpoint } | null> {
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
  const pathRegex = /(?:\/|https:\/\/api\.(?:atomgit|gitcode)\.com\/)api\/v5\/[a-zA-Z0-9\-\_\.\/\{\}\:]+/g;
  const matches = html.match(pathRegex);
  let endpointPath = 'Unknown';
  
  if (matches) {
      const paths = matches.filter((m: string) => m.length > 10 && !m.endsWith('api/v5'));
      if (paths.length > 0) {
          let bestPath = paths[0];
          if (bestPath.startsWith('http')) {
              try {
                  const urlObj = new URL(bestPath);
                  bestPath = urlObj.pathname;
              } catch (e) {}
          }
          endpointPath = bestPath;
      }
  }

  return {
      category,
      endpoint: {
          name: title,
          httpMethod: method,
          endpointPath,
          documentationUrl: url
      }
  };
}

async function main() {
  console.log('Fetching sitemap...');
  const sitemapXml = await fetchUrl(SITEMAP_URL);
  if (!sitemapXml) return;

  // Extract URLs
  const urlRegex = /<loc>(https:\/\/docs\.gitcode\.com\/docs\/apis\/[^<]+)<\/loc>/g;
  const urls: string[] = [];
  let match;
  while ((match = urlRegex.exec(sitemapXml)) !== null) {
      const u = match[1];
      if (u !== 'https://docs.gitcode.com/docs/apis/') {
        urls.push(u);
      }
  }

  console.log(`Found ${urls.length} API pages.`);

  const categoriesMap = new Map<string, ApiEndpoint[]>();
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
              if (!categoriesMap.has(res.category)) {
                  categoriesMap.set(res.category, []);
              }
              categoriesMap.get(res.category)!.push(res.endpoint);
          }
      }
      processed += chunk.length;
      process.stdout.write(`\rProcessed ${processed}/${urls.length}`);
  }
  console.log('\nProcessing complete.');

  // Sort and build JSON
  const categories: Category[] = [];
  let totalEndpoints = 0;

  const sortedKeys = Array.from(categoriesMap.keys()).sort();

  for (const key of sortedKeys) {
      const endpoints = categoriesMap.get(key)!;
      // Filter valid endpoints
      // We accept 'Unknown' path if the page clearly looks like an API doc (has a method)
      // Or if it's "Oauth" which might be special.
      const validEndpoints = endpoints.filter(e => {
          // Exclude "Intro" pages which might have title but no method/path
          if (e.httpMethod === 'Unknown' && e.endpointPath === 'Unknown') return false;
          return true;
      });
      
      if (validEndpoints.length > 0) {
          categories.push({
              name: key,
              endpointCount: validEndpoints.length,
              endpoints: validEndpoints
          });
          totalEndpoints += validEndpoints.length;
      }
  }

  const output = {
      totalEndpoints,
      categories
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Updated ${OUTPUT_FILE}`);
}

main();
