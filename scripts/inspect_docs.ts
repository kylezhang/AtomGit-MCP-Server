
import axios from 'axios';
import * as cheerio from 'cheerio';

async function main() {
  try {
    const url = 'https://docs.gitcode.com/docs/apis/get-api-v-5-repos-owner-repo-git-trees-sha';
    console.log(`Fetching ${url}...`);
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // 1. Title
    const title = $('h1').first().text().trim();
    console.log(`Title: ${title}`);

    // 2. Breadcrumbs
    const breadcrumbs: string[] = [];
    $('.breadcrumbs__item').each((i, el) => {
        breadcrumbs.push($(el).text().trim());
    });
    console.log(`Breadcrumbs: ${breadcrumbs.join(' > ')}`);

    // 3. HTTP Method
    // The previous run found "GET", so that works.
    let method = $('.badge').first().text().trim();
    if (!method) {
        // Try finding standard method strings
        const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
        $('span, div, p').each((i, el) => {
            const txt = $(el).text().trim().toUpperCase();
            if (methods.includes(txt)) {
                method = txt;
                return false; // break
            }
        });
    }
    console.log(`Method: ${method}`);

    // 4. Endpoint Path
    // Search in full HTML for the URL pattern
    const pathRegex = /(?:\/|https:\/\/api\.(?:atomgit|gitcode)\.com\/)api\/v5\/[a-zA-Z0-9\-\_\.\/\{\}\:]+/g;
    const matches = html.match(pathRegex);
    if (matches) {
        // Filter out those that look like just the base URL
        const paths = matches.filter((m: string) => m.length > 20 && !m.endsWith('api/v5'));
        // Prefer short relative paths if available, or convert absolute to relative
        const bestPath = paths[0];
        console.log(`Path Matches:`, paths);
        
        let finalPath = bestPath;
        if (finalPath.startsWith('http')) {
            const urlObj = new URL(finalPath);
            finalPath = urlObj.pathname;
        }
        console.log(`Final Path: ${finalPath}`);
    } else {
        console.log('No path found via regex.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
