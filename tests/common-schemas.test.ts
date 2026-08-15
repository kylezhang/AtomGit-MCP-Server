import { stringOrNumberSchema, repoPathProperties, paginationProperties } from '../src/schemas/common.js';

describe('common schemas', () => {
  it('stringOrNumberSchema builds a oneOf schema', () => {
    const schema = stringOrNumberSchema('a number or string');
    expect(schema.oneOf).toEqual([{ type: 'string' }, { type: 'number' }]);
    expect(schema.description).toBe('a number or string');
    expect(schema.default).toBeUndefined();
  });

  it('stringOrNumberSchema includes default only when provided', () => {
    const withDefault = stringOrNumberSchema('desc', 5);
    expect(withDefault.default).toBe(5);

    const withoutDefault = stringOrNumberSchema('desc');
    expect('default' in withoutDefault).toBe(false);
  });

  it('repoPathProperties exposes owner and repo', () => {
    expect(Object.keys(repoPathProperties)).toEqual(['owner', 'repo']);
    expect(repoPathProperties.owner.type).toBe('string');
    expect(repoPathProperties.repo.type).toBe('string');
  });

  it('paginationProperties spreads shared pagination and autoPaginate fields', () => {
    expect(paginationProperties.page.type).toBe('number');
    expect(paginationProperties.perPage.type).toBe('number');
    expect(paginationProperties.keyword.type).toBe('string');
    expect(paginationProperties.autoPaginate.type).toBe('boolean');
    expect(paginationProperties.maxPages.oneOf).toEqual([{ type: 'string' }, { type: 'number' }]);
  });
});
