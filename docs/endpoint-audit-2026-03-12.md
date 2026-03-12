# Endpoint Audit

- Date: `2026-03-12`
- Scope: `src/services/*.ts`, `src/tools/*.ts`, `docs/apis_url.json`, `docs/api_tool_map.md`
- Documented endpoints: `248`
- Service endpoint literals found: `252`
- Exact doc matches after fixes: `210`
- Remaining non-exact items: `42`

## Confirmed Fixes

The following endpoint mismatches were confirmed against live AtomGit API responses and fixed:

| Area | Old | New |
| --- | --- | --- |
| Repository download statistics | `/download-statistics` | `/download_statistics` |
| Repository push config | `/push-config` | `/push_config` |
| Repository pull request settings | `/pull-request-settings` | `/pull_request_settings` |
| Repository customized roles | `/customized-roles` | `/customized_roles` |
| Repository contributors statistic | `/contributors-statistic` | `/contributors/statistic` |
| Repository events | `/events/access-token/${accessToken}` | `/events` |
| Collaborator self permission | `/collaborators/self_permission` | `/collaborators/self-permission` |

## Tool Schema Fixes

| Tool | Change |
| --- | --- |
| `get_repository_events` | Removed obsolete required `accessToken` input from schema and tool dispatch |

## Verification

- `npm run build`: passed
- `npm run api:map`: passed and regenerated `docs/api_tool_map.md`

## Clarification

- `audio_transcription` is **not** a code bug.
- The runtime API endpoint is `POST /api/v5/audio/transcriptions`.
- The official documentation page URL currently remains `https://docs.gitcode.com/docs/apis/post-api-v-1-audio-transcriptions`.
- So this generated mapping is intentionally:
  - endpoint text: `POST /api/v5/audio/transcriptions`
  - documentation link: `post-api-v-1-audio-transcriptions`

## Remaining Non-Exact Items

These endpoints still do not match `docs/apis_url.json` by simple literal comparison, but they are not all confirmed bugs. Most fall into one of these buckets:

- The docs source uses a different path expression than the generated map logic.
- The endpoint is covered by manual overrides in `scripts/generate_map.ts`.
- The endpoint contains dynamic path composition that the simple extractor cannot normalize well.
- The docs source itself appears inconsistent.

Current remaining candidates include:

- `src/services/EnterpriseService.ts`
- `src/services/OrganizationService.ts`
- `src/services/ReleaseService.ts`
- `src/services/RepositoriesService.ts` (`git/trees/main`, `module-setting`)
- `src/services/AIHubService.ts`
- `src/services/LabelsService.ts`
- `src/services/CommitService.ts`
- `src/services/IssuesService.ts`
- `src/services/PullRequestService.ts`
- `src/services/DashboardService.ts`

These require endpoint-by-endpoint validation rather than string normalization alone.
