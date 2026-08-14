import { autoPaginateSchemaProperties } from '../core/PaginationHelper.js';

export const stringOrNumberSchema = (description: string, defaultValue?: number) => ({
  oneOf: [
    { type: 'string' },
    { type: 'number' }
  ],
  description,
  ...(defaultValue !== undefined ? { default: defaultValue } : {})
});

export const repoPathProperties = {
  owner: {
    type: 'string',
    description: '仓库所属空间地址(组织或个人的地址path)'
  },
  repo: {
    type: 'string',
    description: '仓库路径(path)'
  }
};

export const paginationProperties = {
  keyword: {
    type: 'string',
    description: '关键字过滤'
  },
  page: {
    type: 'number',
    description: '当前页码'
  },
  perPage: {
    type: 'number',
    description: '每页的项目数'
  },
  ...autoPaginateSchemaProperties,
};
