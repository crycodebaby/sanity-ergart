import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Mitteilungen',
  type: 'document',
  groups: [
    {name: 'content', title: 'Inhalt', default: true},
    {name: 'display', title: 'Anzeige'},
    {name: 'schedule', title: 'Zeitraum'},
  ],
  fields: [
    // ==================== INHALT ====================
    defineField({
      name: 'title',
      title: 'Überschrift (optional)',
      type: 'string',
      group: 'content',
      description:
        'Kurze Überschrift – wird fett über der Nachricht angezeigt. Beispiel: „Wichtiger Hinweis"',
    }),
    defineField({
      name: 'message',
      title: 'Nachricht',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required().max(200),
      description:
        'Kurzer Text, der den Hinweis beschreibt. Beispiel: „Wir machen vom 01.08. bis 15.08. Betriebsferien." (max. 200 Zeichen)',
    }),
    defineField({
      name: 'cta',
      title: 'Aktions-Button (optional)',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'text',
          title: 'Button-Text',
          type: 'string',
          description: 'Text auf dem Button. Beispiel: „Mehr erfahren" oder „Jetzt anfragen"',
        },
        {
          name: 'url',
          title: 'Button-Link',
          type: 'string',
          description: 'Wohin soll der Button führen? Beispiel: /kontakt oder /leistungen',
        },
      ],
      description: 'Optionaler Button am Ende der Mitteilung, der zu einer anderen Seite führt.',
    }),

    // ==================== ANZEIGE ====================
    defineField({
      name: 'placement',
      title: 'Wo soll die Mitteilung angezeigt werden?',
      type: 'string',
      group: 'display',
      options: {
        list: [
          {title: 'Schmale Leiste ganz oben (für kurze Hinweise)', value: 'topbar'},
          {title: 'Großes Banner unter dem Kopfbereich (gut sichtbar)', value: 'banner'},
          {title: 'Hinweis-Kasten im Textbereich (z.B. auf Karriere-Seiten)', value: 'inline'},
        ],
        layout: 'radio',
      },
      initialValue: 'topbar',
      validation: (Rule) => Rule.required(),
      description:
        'Wähle, an welcher Stelle auf der Webseite diese Mitteilung zu sehen sein soll.',
    }),
    defineField({
      name: 'type',
      title: 'Art der Mitteilung',
      type: 'string',
      group: 'display',
      options: {
        list: [
          {title: '💡 Info – z.B. neue Leistung, neue Region', value: 'info'},
          {title: '⚠️ Hinweis / Warnung – z.B. geänderte Erreichbarkeit', value: 'warning'},
          {title: '✅ Erfolgsmeldung – z.B. „Ausgezeichnet von …"', value: 'success'},
          {title: '🎉 Angebot / Aktion – z.B. Rabatt oder saisonale Aktion', value: 'promo'},
        ],
      },
      initialValue: 'info',
      validation: (Rule) => Rule.required(),
      description:
        'Bestimmt die Farbe und Art der Mitteilung. Beispiel: „Wir sind ab sofort auch in Dormagen für Sie da."',
    }),
    defineField({
      name: 'targetPages',
      title: 'Auf welchen Seiten anzeigen?',
      type: 'string',
      group: 'display',
      options: {
        list: [
          {title: 'Alle Seiten', value: 'all'},
          {title: 'Nur Startseite', value: 'home'},
          {title: 'Nur Blog', value: 'blog'},
          {title: 'Nur Karriere', value: 'karriere'},
        ],
      },
      initialValue: 'all',
      description:
        'Bestimmt, auf welchen Seiten diese Mitteilung erscheint. „Alle Seiten" zeigt sie überall.',
    }),
    defineField({
      name: 'priority',
      title: 'Wichtigkeit (1–10)',
      type: 'number',
      group: 'display',
      validation: (Rule) => Rule.required().min(1).max(10).integer(),
      initialValue: 5,
      description:
        'Zahl von 1 bis 10. Je höher die Zahl, desto wichtiger. Bei mehreren aktiven Mitteilungen wird nur die mit der höchsten Zahl gezeigt.',
    }),

    // ==================== ZEITRAUM ====================
    defineField({
      name: 'isActive',
      title: 'Mitteilung aktiv?',
      type: 'boolean',
      group: 'schedule',
      initialValue: false,
      description: 'Nur wenn eingeschaltet, wird die Mitteilung auf der Webseite angezeigt.',
    }),
    defineField({
      name: 'startDate',
      title: 'Ab wann anzeigen?',
      type: 'datetime',
      group: 'schedule',
      options: {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm',
      },
      description: 'Erst ab diesem Datum erscheint die Mitteilung. Leer = sofort aktiv.',
    }),
    defineField({
      name: 'endDate',
      title: 'Bis wann anzeigen?',
      type: 'datetime',
      group: 'schedule',
      options: {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm',
      },
      description: 'Nach diesem Datum verschwindet die Mitteilung automatisch. Leer = unbegrenzt.',
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = context.document?.startDate as string | undefined
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'Das End-Datum darf nicht vor dem Start-Datum liegen.'
          }
          return true
        }),
    }),
  ],

  preview: {
    select: {
      message: 'message',
      title: 'title',
      type: 'type',
      placement: 'placement',
      isActive: 'isActive',
      startDate: 'startDate',
      endDate: 'endDate',
      priority: 'priority',
    },
    prepare({message, title, type, placement, isActive, startDate, endDate, priority}) {
      const icons = {info: '💡', warning: '⚠️', success: '✅', promo: '🎉'}
      const icon = icons[type as keyof typeof icons] || '💡'

      const placementLabels = {topbar: 'Leiste', banner: 'Banner', inline: 'Kasten'}
      const placementLabel = placementLabels[placement as keyof typeof placementLabels] || 'Leiste'

      // Ermittle Status: Aktiv, Geplant, Abgelaufen
      const now = new Date()
      let status = '🔴 Inaktiv'
      if (isActive) {
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null
        if (end && end < now) {
          status = '⏹️ Abgelaufen'
        } else if (start && start > now) {
          status = '⏱️ Geplant'
        } else {
          status = '🟢 Aktiv'
        }
      }

      const displayTitle = title || message?.substring(0, 50) || 'Neue Mitteilung'
      const truncatedTitle =
        displayTitle.length > 50 ? displayTitle.substring(0, 50) + '...' : displayTitle

      return {
        title: `${icon} ${truncatedTitle}`,
        subtitle: `${status} | ${placementLabel} | Priorität ${priority}`,
      }
    },
  },

  orderings: [
    {
      title: 'Wichtigkeit (höchste zuerst)',
      name: 'priorityDesc',
      by: [{field: 'priority', direction: 'desc'}],
    },
    {
      title: 'Neueste zuerst',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
    {
      title: 'Status (Aktive zuerst)',
      name: 'activeFirst',
      by: [{field: 'isActive', direction: 'desc'}],
    },
  ],
})
