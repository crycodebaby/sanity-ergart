import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog-Artikel',
  type: 'document',
  fields: [
    // Basis-Felder
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
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const {document, getClient} = context
          const client = getClient({apiVersion: '2023-01-01'})
          const id = document?._id?.replace(/^drafts\./, '')
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug: slug,
          }
          const query = `!defined(*[_type == "post" && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`
          const result = await client.fetch(query, params)
          return result
        },
      },
      validation: (Rule) => Rule.required().error('Slug ist erforderlich'),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'mainImage',
      title: 'Hauptbild',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Wichtig für SEO und Barrierefreiheit',
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Kategorien',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung / Teaser',
      type: 'text',
      rows: 3,
      description: 'Erscheint in der Blog-Übersicht',
      validation: (Rule) => Rule.max(200).warning('Sollte unter 200 Zeichen sein'),
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'blockContent',
    }),

    // SEO-Felder
    defineField({
      name: 'metaTitle',
      title: 'SEO Titel',
      type: 'string',
      description: 'Wird als Seitentitel in Google angezeigt (max. 60 Zeichen)',
      validation: (Rule) => 
        Rule.max(60)
          .warning('Sollte unter 60 Zeichen sein')
          .custom((value, context) => {
            const title = context.document?.title as string
            if (!value && !title) {
              return 'Entweder Meta-Titel oder Titel muss ausgefüllt sein'
            }
            return true
          }),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Beschreibung',
      type: 'text',
      rows: 3,
      description: 'Wird als Beschreibung in Google angezeigt (max. 160 Zeichen)',
      validation: (Rule) => 
        Rule.max(160)
          .warning('Sollte unter 160 Zeichen sein')
          .min(120)
          .warning('Sollte mindestens 120 Zeichen haben für optimale SEO'),
    }),
    defineField({
      name: 'focusKeywords',
      title: 'Fokus-Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Haupt-Keywords für diesen Artikel (z.B. "Fensterreinigung Neuss")',
      options: {
        layout: 'tags',
      },
    }),

    // Lokales SEO für Neuss & Umgebung
    defineField({
      name: 'locationTags',
      title: 'Standort-Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Relevante Orte (z.B. Neuss, Kaarst, Dormagen)',
      options: {
        list: [
          {title: 'Neuss', value: 'neuss'},
          {title: 'Rhein-Kreis Neuss', value: 'rhein-kreis-neuss'},
          {title: 'Kaarst', value: 'kaarst'},
          {title: 'Dormagen', value: 'dormagen'},
          {title: 'Düsseldorf', value: 'duesseldorf'},
          {title: 'Meerbusch', value: 'meerbusch'},
          {title: 'Grevenbroich', value: 'grevenbroich'},
        ],
      },
    }),

    // Status-Felder
    defineField({
      name: 'isPublished',
      title: 'Veröffentlicht',
      type: 'boolean',
      initialValue: false,
      description: 'Nur veröffentlichte Artikel erscheinen auf der Website',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Als Featured markieren',
      type: 'boolean',
      initialValue: false,
      description: 'Featured Artikel erscheinen auf der Startseite',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      published: 'isPublished',
    },
    prepare(selection) {
      const {author, published, title, media} = selection
      return {
        title: title,
        subtitle: `${published ? '✅' : '🔒'} ${author ? `von ${author}` : 'Kein Autor'}`,
        media: media,
      }
    },
  },
})
