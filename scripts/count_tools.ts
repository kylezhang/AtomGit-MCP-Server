
import { RepositoriesService } from '../src/services/RepositoriesService.js';
import { BranchService } from '../src/services/BranchService.js';
import { IssuesService } from '../src/services/IssuesService.js';
import { SearchService } from '../src/services/SearchService.js';
import { PullRequestService } from '../src/services/PullRequestService.js';
import { CommitService } from '../src/services/CommitService.js';
import { TagService } from '../src/services/TagService.js';
import { LabelsService } from '../src/services/LabelsService.js';
import { MilestoneService } from '../src/services/MilestoneService.js';
import { UserService } from '../src/services/UserService.js';
import { OrganizationService } from '../src/services/OrganizationService.js';
import { WebhooksService } from '../src/services/WebhooksService.js';
import { MemberService } from '../src/services/MemberService.js';
import { ReleaseService } from '../src/services/ReleaseService.js';
import { EnterpriseService } from '../src/services/EnterpriseService.js';
import { DashboardService } from '../src/services/DashboardService.js';
import { OauthService } from '../src/services/OauthService.js';
import { AIHubService } from '../src/services/AIHubService.js';

import { RepositoriesTools } from '../src/tools/RepositoriesTools.js';
import { BranchTools } from '../src/tools/BranchTools.js';
import { IssuesTools } from '../src/tools/IssuesTools.js';
import { SearchTools } from '../src/tools/SearchTools.js';
import { PullRequestTools } from '../src/tools/PullRequestTools.js';
import { CommitTools } from '../src/tools/CommitTools.js';
import { TagTools } from '../src/tools/TagTools.js';
import { LabelsTools } from '../src/tools/LabelsTools.js';
import { MilestoneTools } from '../src/tools/MilestoneTools.js';
import { UserTools } from '../src/tools/UserTools.js';
import { OrganizationTools } from '../src/tools/OrganizationTools.js';
import { WebhooksTools } from '../src/tools/WebhooksTools.js';
import { MemberTools } from '../src/tools/MemberTools.js';
import { ReleaseTools } from '../src/tools/ReleaseTools.js';
import { EnterpriseTools } from '../src/tools/EnterpriseTools.js';
import { DashboardTools } from '../src/tools/DashboardTools.js';
import { OauthTools } from '../src/tools/OauthTools.js';
import { AIHubTools } from '../src/tools/AIHubTools.js';

import * as fs from 'fs';
import * as path from 'path';

const config = { apiBaseUrl: 'https://api.atomgit.com', token: 'mock' };

const registry: any[] = [];

function register(instance: any) {
    registry.push(...instance.getTools());
}

register(new RepositoriesTools(new RepositoriesService(config)));
register(new BranchTools(new BranchService(config)));
register(new IssuesTools(new IssuesService(config)));
register(new SearchTools(new SearchService(config)));
register(new PullRequestTools(new PullRequestService(config)));
register(new CommitTools(new CommitService(config)));
register(new TagTools(new TagService(config)));
register(new LabelsTools(new LabelsService(config)));
register(new MilestoneTools(new MilestoneService(config)));
register(new UserTools(new UserService(config)));
register(new OrganizationTools(new OrganizationService(config)));
register(new WebhooksTools(new WebhooksService(config)));
register(new MemberTools(new MemberService(config)));
register(new ReleaseTools(new ReleaseService(config)));
register(new EnterpriseTools(new EnterpriseService(config)));
register(new DashboardTools(new DashboardService(config)));
register(new OauthTools(new OauthService(config)));
register(new AIHubTools(new AIHubService(config)));

console.log(`Total tools count: ${registry.length}`);
