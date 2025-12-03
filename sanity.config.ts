// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Ergart Karriere Content',
  projectId: '2vj1v9w9',
  dataset: 'production',
  
  plugins: [
    structureTool(),
    visionTool(), // For GROQ Testing
  ],
  
  schema: {
    types: schemaTypes,
  },
})
