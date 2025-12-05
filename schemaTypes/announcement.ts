import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Mitteilungen',
  type: 'document',
  fields: [
    // Content
    defineField({
      name: 'title',
      title: 'Titel (optional)',
      type: 'string',
      description: 'Kurze Überschrift - wird fett dargestellt',
    }),
    defineField({
      name: 'message',
      title: 'Nachricht',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
      description: 'Haupttext der Mitteilung (max. 200 Zeichen)',
    }),
    defineField({
      name: 'cta',
      title: 'Call-to-Action (optional)',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button-Text',
          type: 'string',
          placeholder: 'Mehr erfahren',
        },
        {
          name: 'url',
          title: 'Link',
          type: 'string',
          placeholder: '/kontakt',
        },
      ],
      description: 'Optionaler Link am Ende der Mitteilung',
    }),

    // Status & Timing
    defineField({
      name: 'isActive',
      title: 'Aktiv',
      type: 'boolean',
      initialValue: false,
      description: 'Mitteilung aktivieren/deaktivieren',
    }),
    defineField({
      name: 'startDate',
      title: 'Start-Datum (optional)',
      type: 'datetime',
      description: 'Ab wann soll die Mitteilung angezeigt werden? (leer = sofort)',
    }),
    defineField({
      name: 'endDate',
      title: 'End-Datum (optional)',
      type: 'datetime',
      description: 'Bis wann soll die Mitteilung angezeigt werden? (leer = unbegrenzt)',
    }),

    // Styling
    defineField({
      name: 'type',
      title: 'Typ',
      type: 'string',
      options: {
        list: [
          {title: '💡 Info (blau)', value: 'info'},
          {title: '⚠️ Warnung (gelb)', value: 'warning'},
          {title: '✅ Erfolg (grün)', value: 'success'},
          {title: '🎉 Aktion/Angebot (lila)', value: 'promo'},
        ],
      },
      initialValue: 'info',
      validation: (Rule) => Rule.required(),
      description: 'Bestimmt die Farbe und das Icon',
    }),

    // Priority
    defineField({
      name: 'priority',
      title: 'Priorität',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(10).integer(),
      initialValue: 5,
      description: 'Höhere Zahl = höhere Priorität (wenn mehrere Mitteilungen aktiv sind, wird nur die mit höchster Priorität angezeigt)',
    }),

    // Target
    defineField({
      name: 'targetPages',
      title: 'Zielseiten',
      type: 'string',
      options: {
        list: [
          {title: 'Alle Seiten', value: 'all'},
          {title: 'Nur Startseite', value: 'home'},
          {title: 'Nur Blog', value: 'blog'},
          {title: 'Nur Karriere', value: 'karriere'},
        ],
      },
      initialValue: 'all',
      description: 'Auf welchen Seiten soll die Mitteilung erscheinen?',
    }),
  ],

  preview: {
    select: {
      message: 'message',
      type: 'type',
      isActive: 'isActive',
      startDate: 'startDate',
      priority: 'priority',
    },
    prepare({message, type, isActive, startDate, priority}) {
      const icons = {info: '💡', warning: '⚠️', success: '✅', promo: '🎉'}
      const icon = icons[type as keyof typeof icons] || '💡'
      const status = isActive ? '🟢' : '🔴'
      const dateStr = startDate
        ? new Date(startDate).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
          })
        : 'Kein Datum'

      return {
        title: `${icon} ${message.substring(0, 60)}${message.length > 60 ? '...' : ''}`,
        subtitle: `${status} ${isActive ? 'Aktiv' : 'Inaktiv'} | Priorität: ${priority} | ${dateStr}`,
      }
    },
  },

  orderings: [
    {
      title: 'Priorität (höchste zuerst)',
      name: 'priorityDesc',
      by: [{field: 'priority', direction: 'desc'}],
    },
    {
      title: 'Start-Datum (neueste zuerst)',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
})
