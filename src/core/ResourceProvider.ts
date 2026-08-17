import { RepositoriesService } from '../services/RepositoriesService.js';
import { IssuesService } from '../services/IssuesService.js';
import { PullRequestService } from '../services/PullRequestService.js';
import { CommitService } from '../services/CommitService.js';
import { UserService } from '../services/UserService.js';
import { OrganizationService } from '../services/OrganizationService.js';
import { ActionsService } from '../services/ActionsService.js';
import { BranchService } from '../services/BranchService.js';

export interface ResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceContent {
  uri: string;
  mimeType?: string;
  text: string;
}

export class ResourceProvider {
  constructor(
    private reposService: RepositoriesService,
    private issuesService: IssuesService,
    private pullRequestService: PullRequestService,
    private commitService: CommitService,
    private userService: UserService,
    private organizationService?: OrganizationService,
    private actionsService?: ActionsService,
    private branchService?: BranchService
  ) {}

  listResources(): ResourceDefinition[] {
    return [
      {
        uri: 'atomgit://user',
        name: 'Current User',
        description: 'Information about the currently authenticated user',
        mimeType: 'application/json',
      },
    ];
  }

  listResourceTemplates(): ResourceTemplate[] {
    return [
      {
        uriTemplate: 'atomgit://{owner}/{repo}',
        name: 'Repository Info',
        description: 'Get repository information by owner and repo name',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'atomgit://{owner}/{repo}/readme',
        name: 'Repository README',
        description: 'Get the README content of a repository',
        mimeType: 'text/markdown',
      },
      {
        uriTemplate: 'atomgit://{owner}/{repo}/file/{path}',
        name: 'Repository File',
        description: 'Get the content of a file in a repository',
        mimeType: 'text/plain',
      },
      {
        uriTemplate: 'atomgit://{owner}/{repo}/commit/{sha}',
        name: 'Commit Details',
        description: 'Get details of a specific commit',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'atomgit://{owner}/{repo}/issue/{number}',
        name: 'Issue Details',
        description: 'Get details of a specific issue',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'atomgit://{owner}/{repo}/pull/{number}',
        name: 'Pull Request Details',
        description: 'Get details of a specific pull request',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'atomgit://org/{org}',
        name: 'Organization Info',
        description: 'Get organization information by org path',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'atomgit://{owner}/{repo}/branches',
        name: 'Branch List',
        description: 'List all branches of a repository',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'atomgit://{owner}/{repo}/actions/runs',
        name: 'Workflow Runs',
        description: 'List recent workflow runs of a repository',
        mimeType: 'application/json',
      },
    ];
  }

  async readResource(uri: string): Promise<ResourceContent> {
    const parsed = this.parseUri(uri);
    if (!parsed) {
      throw new Error(`Unknown resource URI: ${uri}`);
    }

    const { owner, repo, resourceType, identifier } = parsed;

    switch (resourceType) {
      case 'user': {
        const user = await this.userService.getCurrentUser();
        return { uri, mimeType: 'application/json', text: JSON.stringify(user, null, 2) };
      }

      case 'repo': {
        if (!owner || !repo) throw new Error('Missing owner/repo');
        const repository = await this.reposService.getRepository(owner, repo);
        return { uri, mimeType: 'application/json', text: JSON.stringify(repository, null, 2) };
      }

      case 'readme': {
        if (!owner || !repo) throw new Error('Missing owner/repo');
        const content = await this.reposService.getRepositoryContent(owner, repo, 'README.md');
        let text: string;
        if (typeof content === 'string') {
          text = content;
        } else if (content.content) {
          try {
            text = Buffer.from(content.content, 'base64').toString('utf-8');
          } catch {
            text = content.content;
          }
        } else {
          text = JSON.stringify(content, null, 2);
        }
        return { uri, mimeType: 'text/markdown', text };
      }

      case 'file': {
        if (!owner || !repo || !identifier) throw new Error('Missing owner/repo/path');
        const fileContent = await this.reposService.getRepositoryContent(owner, repo, identifier);
        let text: string;
        if (typeof fileContent === 'string') {
          text = fileContent;
        } else if (fileContent.content) {
          try {
            text = Buffer.from(fileContent.content, 'base64').toString('utf-8');
          } catch {
            text = fileContent.content;
          }
        } else {
          text = JSON.stringify(fileContent, null, 2);
        }
        return { uri, mimeType: 'text/plain', text };
      }

      case 'commit': {
        if (!owner || !repo || !identifier) throw new Error('Missing owner/repo/sha');
        const commit = await this.commitService.getRepositoryCommit(owner, repo, identifier);
        return { uri, mimeType: 'application/json', text: JSON.stringify(commit, null, 2) };
      }

      case 'issue': {
        if (!owner || !repo || !identifier) throw new Error('Missing owner/repo/number');
        const issue = await this.issuesService.getRepositoryIssue(owner, repo, identifier);
        return { uri, mimeType: 'application/json', text: JSON.stringify(issue, null, 2) };
      }

      case 'pull': {
        if (!owner || !repo || !identifier) throw new Error('Missing owner/repo/number');
        const pr = await this.pullRequestService.getRepositoryPull(owner, repo, parseInt(identifier, 10));
        return { uri, mimeType: 'application/json', text: JSON.stringify(pr, null, 2) };
      }

      case 'org': {
        if (!identifier) throw new Error('Missing org path');
        if (!this.organizationService) throw new Error('Organization service not available');
        const org = await this.organizationService.getOrganization(identifier);
        return { uri, mimeType: 'application/json', text: JSON.stringify(org, null, 2) };
      }

      case 'branches': {
        if (!owner || !repo) throw new Error('Missing owner/repo');
        if (!this.branchService) throw new Error('Branch service not available');
        const branches = await this.branchService.getRepositoryBranches(owner, repo);
        return { uri, mimeType: 'application/json', text: JSON.stringify(branches, null, 2) };
      }

      case 'actions': {
        if (!owner || !repo) throw new Error('Missing owner/repo');
        if (!this.actionsService) throw new Error('Actions service not available');
        const runs = await this.actionsService.getRepositoryActionsRuns(owner, repo, {});
        return { uri, mimeType: 'application/json', text: JSON.stringify(runs, null, 2) };
      }

      default:
        throw new Error(`Unknown resource type: ${resourceType}`);
    }
  }

  private parseUri(uri: string): { owner?: string; repo?: string; resourceType: string; identifier?: string } | null {
    if (!uri.startsWith('atomgit://')) return null;

    const path = uri.slice('atomgit://'.length);
    if (path === 'user') return { resourceType: 'user' };

    const parts = path.split('/');
    if (parts.length < 2) return null;

    // atomgit://org/{org} — org info resource (must precede the repo template,
    // since a two-segment path would otherwise be parsed as owner/repo).
    if (parts[0] === 'org' && parts.length === 2 && parts[1]) {
      return { resourceType: 'org', identifier: parts[1] };
    }

    const owner = parts[0];
    const repo = parts[1];

    if (parts.length === 2) {
      const result: { owner?: string; repo?: string; resourceType: string } = { resourceType: 'repo' };
      if (owner) result.owner = owner;
      if (repo) result.repo = repo;
      return result;
    }

    const resourceType = parts[2] as string;
    const identifier = parts.slice(3).join('/');

    const result: { owner?: string; repo?: string; resourceType: string; identifier?: string } = { resourceType };
    if (owner) result.owner = owner;
    if (repo) result.repo = repo;
    if (identifier) result.identifier = identifier;
    return result;
  }
}