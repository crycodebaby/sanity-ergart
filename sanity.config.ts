import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure' // optional
import jobPosting from './schemaTypes/jobPosting'
import blockContent from './schemaTypes/blockContent'

export default defineConfig({
  name: 'default',
  title: 'Ergart Karriere Content',
  projectId: 'c76lselw',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {types: [jobPosting, blockContent]},
})
