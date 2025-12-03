import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'color',
      title: 'Farbe (für UI)',
      type: 'string',
      options: {
        list: [
          {title: 'Blau', value: 'blue'},
          {title: 'Grün', value: 'green'},
          {title: 'Orange', value: 'orange'},
          {title: 'Rot', value: 'red'},
          {title: 'Lila', value: 'purple'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
