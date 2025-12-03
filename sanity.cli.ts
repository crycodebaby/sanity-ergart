// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: '2vj1v9w9', dataset: 'production'},
  // für stabile Releases ohne CDN-Drift:
  deployment: {autoUpdates: false},
})
