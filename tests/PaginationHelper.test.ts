import { autoPaginate, autoPaginateSchemaProperties } from '../src/core/PaginationHelper.js';

describe('autoPaginate', () => {
  it('returns only the requested page when autoPaginate is off', async () => {
    const fetcher = jest.fn(async (page: number) => [{ page }]);
    const result = await autoPaginate(fetcher, { page: 2, perPage: 30, autoPaginate: false });
    expect(result).toEqual([{ page: 2 }]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(2, 30);
  });

  it('uses per_page as fallback when perPage is missing', async () => {
    const fetcher = jest.fn(async () => []);
    await autoPaginate(fetcher, { page: 1, per_page: 10, autoPaginate: false });
    expect(fetcher).toHaveBeenCalledWith(1, 10);
  });

  it('fetches all pages when autoPaginate is on', async () => {
    const fetcher = jest.fn(async (page: number) => {
      return page === 1 ? Array.from({ length: 30 }, (_, i) => i) : []; // page 1 full, page 2 empty
    });
    const result = await autoPaginate(fetcher, { perPage: 30, autoPaginate: true });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(30);
  });

  it('stops pagination when a page returns fewer than perPage', async () => {
    const fetcher = jest.fn(async () => Array.from({ length: 5 }, (_, i) => i));
    const result = await autoPaginate(fetcher, { perPage: 30, autoPaginate: true });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(5);
  });

  it('respects the maxPages cap', async () => {
    const fetcher = jest.fn(async () => Array.from({ length: 30 }, (_, i) => i));
    const result = await autoPaginate(fetcher, { perPage: 30, autoPaginate: true, maxPages: 3 });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(result).toHaveLength(90);
  });

  it('flattens items from all fetched pages', async () => {
    // Page 1 is full (2 items), page 2 is the last with fewer than perPage
    const fetcher = jest.fn(async (page: number) => {
      return page === 1 ? [1, 2] : [3];
    });
    const result = await autoPaginate(fetcher, { perPage: 2, autoPaginate: true });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 2, 3]);
  });

  it('handles string page/perPage values', async () => {
    const fetcher = jest.fn(async () => []);
    await autoPaginate(fetcher, { page: '3', perPage: '15', autoPaginate: false });
    expect(fetcher).toHaveBeenCalledWith(3, 15);
  });
});

describe('autoPaginateSchemaProperties', () => {
  it('exposes autoPaginate and maxPages with sensible defaults', () => {
    expect(autoPaginateSchemaProperties.autoPaginate.default).toBe(false);
    expect(autoPaginateSchemaProperties.maxPages.default).toBe(100);
    expect(autoPaginateSchemaProperties.maxPages.oneOf).toEqual([{ type: 'string' }, { type: 'number' }]);
  });
});
