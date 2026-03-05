import axios from 'axios';
import { RepositoriesService } from '../src/services/RepositoriesService.js';
import { RepositoriesTools } from '../src/tools/RepositoriesTools.js';
import { PullRequestService } from '../src/services/PullRequestService.js';
import { PullRequestTools } from '../src/tools/PullRequestTools.js';
import { OrganizationService } from '../src/services/OrganizationService.js';
import { OrganizationTools } from '../src/tools/OrganizationTools.js';
import { IssuesTools } from '../src/tools/IssuesTools.js';
import { IssuesService } from '../src/services/IssuesService.js';

// Mock Axios
const mockRequests: any[] = [];
const mockClient = {
  get: async (url: string, config?: any) => {
    mockRequests.push({ method: 'get', url, config });
    return { data: { mock: true, url, method: 'get' } };
  },
  post: async (url: string, data?: any, config?: any) => {
    mockRequests.push({ method: 'post', url, data, config });
    return { data: { mock: true, url, method: 'post' } };
  },
  put: async (url: string, data?: any, config?: any) => {
    mockRequests.push({ method: 'put', url, data, config });
    return { data: { mock: true, url, method: 'put' } };
  },
  delete: async (url: string, config?: any) => {
    mockRequests.push({ method: 'delete', url, config });
    return { data: { mock: true, url, method: 'delete' } };
  },
  patch: async (url: string, data?: any, config?: any) => {
    mockRequests.push({ method: 'patch', url, data, config });
    return { data: { mock: true, url, method: 'patch' } };
  }
};

// Hijack axios.create
(axios as any).create = () => mockClient;

const config = {
  apiBaseUrl: 'https://api.atomgit.com',
  token: 'test-token'
};

async function runTests() {
  console.log('🚀 Starting Comprehensive Tests...');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      mockRequests.length = 0; // Clear mocks
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(error);
      failed++;
    }
  }

  // Test 1: RepositoriesTools - Upload File
  await test('RepositoriesTools.upload_repository_file', async () => {
    const service = new RepositoriesService(config);
    const tools = new RepositoriesTools(service);
    
    await tools.callTool('upload_repository_file', {
      owner: 'test-owner',
      repo: 'test-repo',
      fileData: 'base64content',
      filename: 'test.txt'
    });

    const req = mockRequests[0];
    if (req.url !== '/api/v5/repos/test-owner/test-repo/file/upload') throw new Error(`URL mismatch: ${req.url}`);
    if (req.data.file !== 'base64content') throw new Error(`File content mismatch: ${req.data.file}`);
    if (req.data.filename !== 'test.txt') throw new Error(`Filename mismatch: ${req.data.filename}`);
  });

  // Test 2: PullRequestTools - Get Commits (Pagination)
  await test('PullRequestTools.get_repository_pull_commits', async () => {
    const service = new PullRequestService(config);
    const tools = new PullRequestTools(service);

    await tools.callTool('get_repository_pull_commits', {
      owner: 'test-owner',
      repo: 'test-repo',
      pullNumber: 1,
      page: 2,
      perPage: 50
    });

    const req = mockRequests[0];
    if (req.url !== '/api/v5/repos/test-owner/test-repo/pulls/1/commits') throw new Error(`URL mismatch: ${req.url}`);
    if (req.config.params.page !== 2) throw new Error(`Page mismatch: ${req.config.params.page}`);
    if (req.config.params.per_page !== 50) throw new Error(`PerPage mismatch: ${req.config.params.per_page}`);
  });

  // Test 3: PullRequestTools - Process Test (Action param)
  await test('PullRequestTools.process_repository_pull_test', async () => {
    const service = new PullRequestService(config);
    const tools = new PullRequestTools(service);

    await tools.callTool('process_repository_pull_test', {
      owner: 'test-owner',
      repo: 'test-repo',
      pullNumber: 1,
      action: 'approve',
      comment: 'LGTM'
    });

    const req = mockRequests[0];
    if (req.url !== '/api/v5/repos/test-owner/test-repo/pulls/1/test') throw new Error(`URL mismatch: ${req.url}`);
    if (req.data.action !== 'approve') throw new Error(`Action mismatch: ${req.data.action}`);
    if (req.data.comment !== 'LGTM') throw new Error(`Comment mismatch: ${req.data.comment}`);
  });

  // Test 4: PullRequestTools - Assign Assignees (Nested Array fix)
  await test('PullRequestTools.assign_repository_pull_assignees', async () => {
    const service = new PullRequestService(config);
    const tools = new PullRequestTools(service);

    await tools.callTool('assign_repository_pull_assignees', {
      owner: 'test-owner',
      repo: 'test-repo',
      pullNumber: 1,
      assignees: ['user1', 'user2']
    });

    const req = mockRequests[0];
    if (req.url !== '/api/v5/repos/test-owner/test-repo/pulls/1/assign/assign') throw new Error(`URL mismatch: ${req.url}`);
    // Check if assignees is ['user1', 'user2'] not [['user1', 'user2']]
    if (!Array.isArray(req.data.assignees)) throw new Error('Assignees should be an array');
    if (Array.isArray(req.data.assignees[0])) throw new Error('Assignees should not be a nested array');
    if (req.data.assignees[0] !== 'user1') throw new Error('Assignees content mismatch');
  });

  // Test 5: OrganizationTools - Update Organization (Missing Switch Case)
  await test('OrganizationTools.update_organization', async () => {
    const service = new OrganizationService(config);
    const tools = new OrganizationTools(service);

    await tools.callTool('update_organization', {
      org: 'test-org',
      updateData: { name: 'New Name' }
    });

    const req = mockRequests[0];
    if (req.url !== '/api/v5/orgs/test-org') throw new Error(`URL mismatch: ${req.url}`);
    if (req.method !== 'patch') throw new Error(`Method mismatch: ${req.method}`);
    if (req.data.name !== 'New Name') throw new Error(`Data mismatch: ${req.data.name}`);
  });

   // Test 6: IssuesTools - Delete All Labels (Missing Tool definition)
   await test('IssuesTools.delete_repository_all_issue_labels', async () => {
    const service = new IssuesService(config);
    const tools = new IssuesTools(service);

    // Verify tool is in getTools()
    const toolDefs = tools.getTools();
    const toolDef = toolDefs.find(t => t.name === 'delete_repository_all_issue_labels');
    if (!toolDef) throw new Error('Tool definition missing in getTools()');

    await tools.callTool('delete_repository_all_issue_labels', {
      owner: 'test-owner',
      repo: 'test-repo',
      issueNumber: 1
    });

    const req = mockRequests[0];
    if (req.url !== '/api/v5/repos/test-owner/test-repo/issues/1/labels') throw new Error(`URL mismatch: ${req.url}`);
    if (req.method !== 'delete') throw new Error(`Method mismatch: ${req.method}`);
  });

  console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runTests();
