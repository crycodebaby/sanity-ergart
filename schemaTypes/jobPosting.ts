import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'jobPosting',
  title: 'Stellenanzeige',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Arbeitsort',
      type: 'string',
      initialValue: 'Neuss & Umgebung',
    }),
    defineField({
      name: 'employmentType',
      title: 'Anstellungsart',
      type: 'string',
      options: {
        list: [
          {title: 'Vollzeit', value: 'VOLLZEIT'},
          {title: 'Teilzeit', value: 'TEILZEIT'},
          {title: 'Minijob', value: 'MINIJOB'},
        ],
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      type: 'blockContent',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung (Rich Text)',
      type: 'blockContent',
    }),
    // SEO Felder für Google Optimierung
    defineField({
      name: 'metaTitle',
      title: 'SEO Titel',
      type: 'string',
      description: 'Wird als Seitentitel in Google angezeigt (max. 60 Zeichen)',
      validation: (Rule) => Rule.max(60).warning('Sollte unter 60 Zeichen sein'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Beschreibung',
      type: 'text',
      rows: 3,
      description: 'Wird als Beschreibung in Google angezeigt (max. 160 Zeichen)',
      validation: (Rule) => Rule.max(160).warning('Sollte unter 160 Zeichen sein'),
    }),
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
