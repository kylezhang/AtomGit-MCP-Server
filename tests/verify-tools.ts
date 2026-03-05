
import { config } from 'dotenv';
import { ToolRegistry } from '../src/core/ToolRegistry.js';

// Import services
import { SearchService } from '../src/services/SearchService.js';
import { OauthService } from '../src/services/OauthService.js';
import { MilestoneService } from '../src/services/MilestoneService.js';
import { MemberService } from '../src/services/MemberService.js';
import { WebhooksService } from '../src/services/WebhooksService.js';
import { BranchService } from '../src/services/BranchService.js';
import { TagService } from '../src/services/TagService.js';
import { DashboardService } from '../src/services/DashboardService.js';
import { AIHubService } from '../src/services/AIHubService.js';
import { ReleaseService } from '../src/services/ReleaseService.js';
import { CommitService } from '../src/services/CommitService.js';
import { LabelsService } from '../src/services/LabelsService.js';
import { EnterpriseService } from '../src/services/EnterpriseService.js';
import { OrganizationService } from '../src/services/OrganizationService.js';
import { UserService } from '../src/services/UserService.js';
import { IssuesService } from '../src/services/IssuesService.js';
import { PullRequestService } from '../src/services/PullRequestService.js';
import { RepositoriesService } from '../src/services/RepositoriesService.js';

// Import tools
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

// Load env
config();

async function verifyTools() {
  console.log('Starting verification...');
  
  const registry = new ToolRegistry();
  
  // Mock config
  const serviceConfig: any = {
    apiBaseUrl: 'https://api.atomgit.com',
    token: 'test-token',
  };

  try {
    // Register all tools and track counts
    const toolClasses = [
      { name: 'Repositories', instance: new RepositoriesTools(new RepositoriesService(serviceConfig)) },
      { name: 'Branch', instance: new BranchTools(new BranchService(serviceConfig)) },
      { name: 'Issues', instance: new IssuesTools(new IssuesService(serviceConfig)) },
      { name: 'Search', instance: new SearchTools(new SearchService(serviceConfig)) },
      { name: 'PullRequest', instance: new PullRequestTools(new PullRequestService(serviceConfig)) },
      { name: 'Commit', instance: new CommitTools(new CommitService(serviceConfig)) },
      { name: 'Tag', instance: new TagTools(new TagService(serviceConfig)) },
      { name: 'Labels', instance: new LabelsTools(new LabelsService(serviceConfig)) },
      { name: 'Milestone', instance: new MilestoneTools(new MilestoneService(serviceConfig)) },
      { name: 'User', instance: new UserTools(new UserService(serviceConfig)) },
      { name: 'Organization', instance: new OrganizationTools(new OrganizationService(serviceConfig)) },
      { name: 'Webhooks', instance: new WebhooksTools(new WebhooksService(serviceConfig)) },
      { name: 'Member', instance: new MemberTools(new MemberService(serviceConfig)) },
      { name: 'Release', instance: new ReleaseTools(new ReleaseService(serviceConfig)) },
      { name: 'Enterprise', instance: new EnterpriseTools(new EnterpriseService(serviceConfig)) },
      { name: 'Dashboard', instance: new DashboardTools(new DashboardService(serviceConfig)) },
      { name: 'Oauth', instance: new OauthTools(new OauthService(serviceConfig)) },
      { name: 'AIHub', instance: new AIHubTools(new AIHubService(serviceConfig)) }
    ];

    console.log('--- Tool Counts per Category ---');
    const allNames = new Set<string>();
    for (const { name, instance } of toolClasses) {
      const tools = instance.getTools();
      const count = tools.length;
      console.log(`${name}: ${count}`);
      
      for (const tool of tools) {
        if (allNames.has(tool.name)) {
          console.error(`🚨 DUPLICATE TOOL FOUND: ${tool.name} in ${name}`);
        }
        allNames.add(tool.name);
      }
      
      registry.registerTools(instance);
    }
    console.log('--------------------------------');

    const tools = registry.getAllTools();
    console.log(`✅ Total tools registered: ${tools.length}`);

    // Print counts per prefix (heuristic)
    const prefixes = [
      'repo', 'branch', 'issue', 'search', 'pull', 'commit', 'tag', 'label', 'milestone',
      'user', 'org', 'webhook', 'member', 'release', 'enterprise', 'dashboard', 'oauth', 
      'chat', 'sentence', 'audio', 'object', 'video' // AI Hub
    ];
    
    // Group by first word of name (split by _)
    const counts: Record<string, number> = {};
    tools.forEach(t => {
      const prefix = t.name.split('_')[0];
      counts[prefix] = (counts[prefix] || 0) + 1;
    });
    console.log('Tool counts by prefix:', counts);
    
    // Verification Checks
    if (tools.length !== 240) {
      console.error(`❌ Expected 240 tools, but got ${tools.length}`);
      process.exit(1);
    }

    // Verify AI Hub tools specifically
    const aiTools = tools.filter(t => [
      'chat_completion', 
      'sentence_similarity', 
      'audio_transcription', 
      'object_detection', 
      'video_generation_create', 
      'video_generation_status', 
      'audio_classification'
    ].includes(t.name));

    if (aiTools.length !== 7) {
      console.error(`❌ Expected 7 AI Hub tools, but got ${aiTools.length}`);
      console.log('Found AI tools:', aiTools.map(t => t.name));
      process.exit(1);
    }
    
    console.log('✅ AI Hub tools verified successfully');
    console.log('🎉 All checks passed!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyTools();
