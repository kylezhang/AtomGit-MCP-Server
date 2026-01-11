export class OrganizationTools {
    atomGitService;
    constructor(atomGitService) {
        this.atomGitService = atomGitService;
    }
    getTools() {
        return [
            {
                name: 'create_organization',
                description: '创建新组织',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: '组织显示名称'
                        },
                        org: {
                            type: 'string',
                            description: '组织命名空间（URL标识符）'
                        },
                        description: {
                            type: 'string',
                            description: '组织描述（可选）'
                        }
                    },
                    required: ['name', 'org']
                }
            },
            {
                name: 'get_organization',
                description: '获取组织信息',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        }
                    },
                    required: ['org']
                }
            },
            {
                name: 'create_organization_repository',
                description: '为组织创建仓库',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        repoData: {
                            type: 'object',
                            description: '仓库创建数据（包含name、description、private等）'
                        }
                    },
                    required: ['org', 'repoData']
                }
            },
            {
                name: 'get_organization_members',
                description: '获取组织成员列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        }
                    },
                    required: ['org']
                }
            },
            {
                name: 'add_organization_member',
                description: '添加组织成员',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        username: {
                            type: 'string',
                            description: '要添加的用户名'
                        },
                        memberData: {
                            type: 'object',
                            description: '成员数据和权限'
                        }
                    },
                    required: ['org', 'username', 'memberData']
                }
            },
            {
                name: 'remove_organization_member',
                description: '移除组织成员',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        username: {
                            type: 'string',
                            description: '要移除的用户名'
                        }
                    },
                    required: ['org', 'username']
                }
            },
            {
                name: 'get_organization_projects',
                description: '获取组织项目列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        }
                    },
                    required: ['org']
                }
            },
            {
                name: 'create_organization_project',
                description: '创建组织项目',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        projectData: {
                            type: 'object',
                            description: '项目数据（包含name、description等）'
                        }
                    },
                    required: ['org', 'projectData']
                }
            },
            {
                name: 'update_organization_project',
                description: '更新组织项目',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        project: {
                            type: 'string',
                            description: '项目名'
                        },
                        projectData: {
                            type: 'object',
                            description: '更新的项目数据'
                        }
                    },
                    required: ['org', 'project', 'projectData']
                }
            },
            {
                name: 'delete_organization_project',
                description: '删除组织项目',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        project: {
                            type: 'string',
                            description: '项目名'
                        }
                    },
                    required: ['org', 'project']
                }
            },
            {
                name: 'get_organization_teams',
                description: '获取组织团队列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        }
                    },
                    required: ['org']
                }
            },
            {
                name: 'create_organization_team',
                description: '创建组织团队',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        teamData: {
                            type: 'object',
                            description: '团队数据（包含name、description、permission等）'
                        }
                    },
                    required: ['org', 'teamData']
                }
            },
            {
                name: 'update_organization_team',
                description: '更新组织团队',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        team: {
                            type: 'string',
                            description: '团队名'
                        },
                        teamData: {
                            type: 'object',
                            description: '更新的团队数据'
                        }
                    },
                    required: ['org', 'team', 'teamData']
                }
            },
            {
                name: 'delete_organization_team',
                description: '删除组织团队',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        team: {
                            type: 'string',
                            description: '团队名'
                        }
                    },
                    required: ['org', 'team']
                }
            },
            {
                name: 'get_organization_team_members',
                description: '获取组织团队成员列表',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        team: {
                            type: 'string',
                            description: '团队名'
                        }
                    },
                    required: ['org', 'team']
                }
            },
            {
                name: 'add_organization_team_member',
                description: '添加组织团队成员',
                inputSchema: {
                    type: 'object',
                    properties: {
                        org: {
                            type: 'string',
                            description: '组织名'
                        },
                        team: {
                            type: 'string',
                            description: '团队名'
                        },
                        username: {
                            type: 'string',
                            description: '要添加的用户名'
                        },
                        memberData: {
                            type: 'object',
                            description: '成员数据和权限'
                        }
                    },
                    required: ['org', 'team', 'username', 'memberData']
                }
            }
        ];
    }
    async callTool(name, args) {
        switch (name) {
            case 'create_organization':
                return await this.atomGitService.createOrganization({
                    name: args.name,
                    org: args.org,
                    description: args.description
                });
            case 'get_organization':
                return await this.atomGitService.getOrganization(args.org);
            case 'create_organization_repository':
                return await this.atomGitService.createOrganizationRepository(args.org, args.repoData);
            case 'get_organization_members':
                return await this.atomGitService.getOrganizationMembers(args.org);
            case 'add_organization_member':
                return await this.atomGitService.addOrganizationMember(args.org, args.username, args.memberData);
            case 'remove_organization_member':
                return await this.atomGitService.removeOrganizationMember(args.org, args.username);
            case 'get_organization_projects':
                return await this.atomGitService.getOrganizationProjects(args.org);
            case 'create_organization_project':
                return await this.atomGitService.createOrganizationProject(args.org, args.projectData);
            case 'update_organization_project':
                return await this.atomGitService.updateOrganizationProject(args.org, args.project, args.projectData);
            case 'delete_organization_project':
                return await this.atomGitService.deleteOrganizationProject(args.org, args.project);
            case 'get_organization_teams':
                return await this.atomGitService.getOrganizationTeams(args.org);
            case 'create_organization_team':
                return await this.atomGitService.createOrganizationTeam(args.org, args.teamData);
            case 'update_organization_team':
                return await this.atomGitService.updateOrganizationTeam(args.org, args.team, args.teamData);
            case 'delete_organization_team':
                return await this.atomGitService.deleteOrganizationTeam(args.org, args.team);
            case 'get_organization_team_members':
                return await this.atomGitService.getOrganizationTeamMembers(args.org, args.team);
            case 'add_organization_team_member':
                return await this.atomGitService.addOrganizationTeamMember(args.org, args.team, args.username, args.memberData);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
}
//# sourceMappingURL=OrganizationTools.js.map