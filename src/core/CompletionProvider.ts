import type { CompleteRequestParams } from '@modelcontextprotocol/sdk/types.js';
import { UserService } from '../services/UserService.js';
import { OrganizationService } from '../services/OrganizationService.js';

export interface CompletionResult {
  values: string[];
  total?: number;
}

const MAX_VALUES = 100;

/**
 * CompletionProvider - MCP `completion/complete` support.
 *
 * Completes `owner` / `repo` arguments for the `atomgit://{owner}/{repo}`-style
 * resource templates from the authenticated user's namespaces, organizations
 * and repositories. Any failure (missing token, network error, unknown ref)
 * degrades to an empty result so clients never see a thrown error.
 */
export class CompletionProvider {
  constructor(
    private userService: UserService,
    private organizationService: OrganizationService
  ) {}

  /**
   * Complete an argument of a resource template ref (or prompt ref).
   */
  async complete(params: CompleteRequestParams): Promise<CompletionResult> {
    try {
      const ref = params.ref;
      if (ref.type !== 'ref/resource') {
        // Prompt arguments are free-form; nothing to suggest.
        return { values: [] };
      }

      const argument = params.argument;
      const prefix = argument.value ?? '';

      switch (argument.name) {
        case 'owner':
          return await this.completeOwner(prefix);
        case 'repo':
          return await this.completeRepo(prefix);
        default:
          return { values: [] };
      }
    } catch {
      // Never propagate completion errors to the client.
      return { values: [] };
    }
  }

  private async completeOwner(prefix: string): Promise<CompletionResult> {
    const owners: string[] = [];

    try {
      const user = await this.userService.getCurrentUser();
      const username = user?.username ?? user?.login ?? user?.name;
      if (username) owners.push(String(username));
    } catch {
      // ignore: fall back to orgs only
    }

    try {
      const orgs = await this.organizationService.getCurrentUserOrganizations(1, 100);
      for (const org of orgs ?? []) {
        const name = org?.path ?? org?.name ?? org?.username;
        if (name) owners.push(String(name));
      }
    } catch {
      // ignore: orgs may be unavailable
    }

    // Also include namespaces reported by the user endpoint (covers orgs too).
    try {
      const namespaces = await this.userService.getCurrentUserNamespaces({ page: 1, perPage: 100 });
      for (const ns of namespaces ?? []) {
        const name = ns?.path ?? ns?.name ?? ns?.username;
        if (name) owners.push(String(name));
      }
    } catch {
      // ignore
    }

    const unique = [...new Set(owners)];
    const filtered = unique
      .filter((owner) => owner.toLowerCase().startsWith(prefix.toLowerCase()))
      .slice(0, MAX_VALUES);

    return { values: filtered, total: unique.length };
  }

  private async completeRepo(prefix: string): Promise<CompletionResult> {
    let repos: string[] = [];

    try {
      const list = await this.userService.getCurrentUserRepos({ page: 1, perPage: 100 });
      repos = (list ?? [])
        .map((repo) => repo?.name ?? repo?.path ?? repo?.full_name)
        .filter((name): name is string => typeof name === 'string' && name.length > 0);
    } catch {
      // ignore: no repos available
    }

    const filtered = repos
      .filter((repo) => repo.toLowerCase().startsWith(prefix.toLowerCase()))
      .slice(0, MAX_VALUES);

    return { values: filtered, total: repos.length };
  }
}
