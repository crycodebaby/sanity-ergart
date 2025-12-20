/**
 * siteSettings – Zentrale Website-Einstellungen
 *
 * Singleton-Dokument für globale Einstellungen wie das Weihnachts-Design.
 * Kann später für weitere saisonale Aktionen erweitert werden.
 */
import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Website-Einstellungen',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'christmas', title: 'Weihnachts-Design', default: true},
  ],
  fields: [
    // ==================== WEIHNACHTS-DESIGN ====================
    defineField({
      name: 'christmasThemeMode',
      title: 'Weihnachts-Design',
      type: 'string',
      group: 'christmas',
      options: {
        list: [
          {
            title: 'Aus',
            value: 'off',
          },
          {
            title: 'Nur kleiner Weihnachtsgruß',
            value: 'simple',
          },
          {
            title: 'Voller Weihnachtsmodus',
            value: 'full',
          },
        ],
        layout: 'radio',
      },
      initialValue: 'off',
      description: `Wähle, wie das Weihnachts-Design auf der Webseite angezeigt werden soll:
• "Aus" – Kein Weihnachts-Design.
• "Nur kleiner Weihnachtsgruß" – Ein kurzer Weihnachtsgruß im Kopfbereich.
• "Voller Weihnachtsmodus" – Zusätzlich zum Gruß eine dezente Lichterkette und optionaler Schneefall.`,
    }),

    defineField({
      name: 'christmasGreetingText',
      title: 'Text für Weihnachtsgruß',
      type: 'text',
      rows: 2,
      group: 'christmas',
      description:
        'Dieser Text wird als Weihnachtsgruß auf der Webseite gezeigt. Beispiel: „Wir wünschen Ihnen frohe Weihnachten und einen guten Rutsch ins neue Jahr. Ihr Ergart-Team."',
      hidden: ({document}) => document?.christmasThemeMode === 'off',
    }),

    defineField({
      name: 'christmasStartDate',
      title: 'Weihnachtszeit: Beginn (optional)',
      type: 'datetime',
      group: 'christmas',
      options: {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm',
      },
      description:
        'Optional: Ab wann soll das Weihnachts-Design automatisch aktiv sein? Wenn leer, gilt nur die Auswahl oben.',
      hidden: ({document}) => document?.christmasThemeMode === 'off',
    }),

    defineField({
      name: 'christmasEndDate',
      title: 'Weihnachtszeit: Ende (optional)',
      type: 'datetime',
      group: 'christmas',
      options: {
        dateFormat: 'DD.MM.YYYY',
        timeFormat: 'HH:mm',
      },
      description:
        'Optional: Bis wann soll das Weihnachts-Design aktiv sein? Wenn leer, bleibt es unbegrenzt aktiv.',
      hidden: ({document}) => document?.christmasThemeMode === 'off',
      validation: (Rule) =>
        Rule.custom((endDate, context) => {
          const startDate = context.document?.christmasStartDate as string | undefined
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'Das End-Datum darf nicht vor dem Start-Datum liegen.'
          }
          return true
        }),
    }),
  ],

  preview: {
    select: {
      mode: 'christmasThemeMode',
    },
    prepare({mode}) {
      const modeLabels: Record<string, string> = {
        off: '❄️ Weihnachts-Design: Aus',
        simple: '🎄 Weihnachts-Design: Kleiner Gruß',
        full: '🎅 Weihnachts-Design: Voller Modus',
      }
      return {
        title: 'Website-Einstellungen',
        subtitle: modeLabels[mode] || 'Nicht konfiguriert',
      }
    },
  },
})
