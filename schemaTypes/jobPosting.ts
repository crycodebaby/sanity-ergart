import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'jobPosting',
  title: 'Stellenanzeige',
  type: 'document',
  groups: [
    {name: 'basic', title: 'Grunddaten', default: true},
    {name: 'content', title: 'Inhalte'},
    {name: 'requirements', title: 'Anforderungen'},
    {name: 'benefits', title: 'Benefits & Fakten'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // BASIC GROUP
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'basic',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Arbeitsort',
      type: 'string',
      group: 'basic',
      initialValue: 'Neuss & Umgebung',
    }),
    defineField({
      name: 'employmentType',
      title: 'Anstellungsart',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          {title: 'Vollzeit', value: 'VOLLZEIT'},
          {title: 'Teilzeit', value: 'TEILZEIT'},
          {title: 'Minijob', value: 'MINIJOB'},
        ],
      },
    }),
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
    }),

    // CONTENT GROUP
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      type: 'blockContent',
      group: 'content',
      description: 'Wird auf der Übersichtsseite angezeigt',
    }),
    defineField({
      name: 'description',
      title: 'Stellenbeschreibung (Rich Text)',
      type: 'blockContent',
      group: 'content',
      description: 'Hauptbeschreibung der Stelle',
    }),
    defineField({
      name: 'responsibilities',
      title: 'Ihre Aufgaben',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      description: 'Liste der Hauptaufgaben',
    }),

    // REQUIREMENTS GROUP
    defineField({
      name: 'requirements',
      title: 'Das bringen Sie mit (Pflicht)',
      type: 'array',
      group: 'requirements',
      of: [{type: 'string'}],
      description: 'Erforderliche Qualifikationen',
    }),
    defineField({
      name: 'niceToHave',
      title: 'Nice-to-Have Qualifikationen',
      type: 'array',
      group: 'requirements',
      of: [{type: 'string'}],
      description: 'Optional: Wünschenswerte Zusatzqualifikationen',
    }),

    // BENEFITS GROUP
    defineField({
      name: 'benefits',
      title: 'Das erwartet Sie (Benefits)',
      type: 'array',
      group: 'benefits',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Lucide Icon Name (z.B. Shield, Euro, Users, Wrench)',
              initialValue: 'CheckCircle',
            },
            {
              name: 'title',
              title: 'Titel',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Beschreibung',
              type: 'text',
              rows: 2,
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        },
      ],
      description: 'Strukturierte Benefits mit Icons',
    }),
    defineField({
      name: 'quickFacts',
      title: 'Quick Facts (Sidebar)',
      type: 'array',
      group: 'benefits',
      of: [{type: 'string'}],
      description: 'Kurze Facts für die Sidebar (z.B. "Unbefristeter Vertrag")',
    }),

    // SEO GROUP
    defineField({
      name: 'metaTitle',
      title: 'SEO Titel',
      type: 'string',
      group: 'seo',
      description: 'Wird als Seitentitel in Google angezeigt (max. 60 Zeichen)',
      validation: (Rule) => Rule.max(60).warning('Sollte unter 60 Zeichen sein'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Beschreibung',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Wird als Beschreibung in Google angezeigt (max. 160 Zeichen)',
      validation: (Rule) => Rule.max(160).warning('Sollte unter 160 Zeichen sein'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      employmentType: 'employmentType',
      isActive: 'isActive',
    },
    prepare({title, subtitle, employmentType, isActive}) {
      return {
        title: title,
        subtitle: `${employmentType || 'Keine Angabe'} | ${subtitle || 'Kein Ort'} ${isActive ? '✅' : '⚠️ Inaktiv'}`,
      }
    },
  },
})
