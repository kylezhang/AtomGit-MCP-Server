# Live Docs Audit

- Date: `2026-03-12`
- Audited rows: `248`
- Clean rows: `248`
- Rows with product issues: `0`
- Rows with known doc-site anomalies: `5`

## Issue Summary

No product-side issues detected.

## Product Findings

No product-side issues detected.

## Known Doc-Site Anomalies

| Tool | Service Method | Displayed Endpoint | Live Doc Endpoint | Issues | Doc URL |
| --- | --- | --- | --- | --- | --- |
| `create_organization_kanban` | `createOrganizationKanban` | `POST /api/v5/org/${owner}/kanban/create` | `PARSE_FAILED` | `live_doc_parse_failed` | https://docs.gitcode.com/docs/apis/post-api-v-5-org-owner-kanban-create |
| `delete_organization_kanban` | `deleteOrganizationKanban` | `DELETE /api/v5/org/${owner}/kanban/${id}` | `PARSE_FAILED` | `live_doc_parse_failed` | https://docs.gitcode.com/docs/apis/delete-api-v-5-org-owner-kanban-id |
| `update_organization_kanban` | `updateOrganizationKanban` | `PUT /api/v5/org/${owner}/kanban/${id}` | `PARSE_FAILED` | `live_doc_parse_failed` | https://docs.gitcode.com/docs/apis/put-api-v-5-org-owner-kanban-id |
| `update_organization_kanban_content` | `updateOrganizationKanbanContent` | `PUT /api/v5/org/${owner}/kanban/${id}/content` | `PARSE_FAILED` | `live_doc_parse_failed` | https://docs.gitcode.com/docs/apis/put-api-v-5-org-owner-kanban-id-content |
| `audio_transcription` | `audioTranscription` | `POST /api/v5/audio/transcriptions` | `POST /api/v5/audio/transcriptions` | `slug_version_differs_from_live_endpoint` | https://docs.gitcode.com/docs/apis/post-api-v-1-audio-transcriptions |
