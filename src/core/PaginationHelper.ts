/**
 * PaginationHelper - Provides automatic pagination support for AtomGit API calls.
 *
 * AtomGit API uses page-based pagination with `page` and `per_page` (or `perPage`) parameters.
 * This helper automatically fetches all pages when `autoPaginate` is enabled.
 */

export interface PaginationOptions {
  page?: number | string;
  perPage?: number | string;
  per_page?: number | string;
  autoPaginate?: boolean;
  maxPages?: number;
}

export interface PaginatedFetcher<T> {
  (page: number, perPage: number): Promise<T[]>;
}

/**
 * Automatically fetch all pages of a paginated API response.
 *
 * @param fetcher - A function that fetches a single page with the given page and perPage
 * @param options - Pagination options
 * @returns All items from all pages (if autoPaginate is true) or just the requested page
 */
export async function autoPaginate<T>(
  fetcher: PaginatedFetcher<T>,
  options: PaginationOptions = {}
): Promise<T[]> {
  const page = Number(options.page ?? 1);
  const perPage = Number(options.perPage ?? options.per_page ?? 30);
  const maxPages = options.maxPages ?? 100;

  // If auto-pagination is not enabled, just fetch the requested page
  if (!options.autoPaginate) {
    return fetcher(page, perPage);
  }

  // Auto-paginate: fetch all pages
  const allItems: T[] = [];
  let currentPage = 1;
  let hasMore = true;

  while (hasMore && currentPage <= maxPages) {
    const items = await fetcher(currentPage, perPage);
    allItems.push(...items);

    // If we got fewer items than perPage, we've reached the last page
    if (items.length < perPage) {
      hasMore = false;
    } else {
      currentPage++;
    }
  }

  return allItems;
}

/**
 * Default pagination properties to add to tool input schemas.
 */
export const autoPaginateSchemaProperties = {
  autoPaginate: {
    type: 'boolean',
    description: '是否自动获取所有页（默认 false，设为 true 时自动获取全部数据）',
    default: false,
  },
  maxPages: {
    oneOf: [
      { type: 'string' },
      { type: 'number' },
    ],
    description: '自动分页时的最大页数限制（默认 100）',
    default: 100,
  },
} as const;