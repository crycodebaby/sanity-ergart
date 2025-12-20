/**
 * Sanity Desk Structure
 * 
 * Organisiert die Studio-Navigation mit einem klaren "Mitteilungen"-Bereich
 * und gefilterten Listen für aktive, geplante und abgelaufene Mitteilungen.
 */
import {StructureBuilder} from 'sanity/structure'
import {BellIcon, CheckmarkCircleIcon, ClockIcon, CloseCircleIcon, CogIcon} from '@sanity/icons'

// Hilfsfunktion zur Berechnung des aktuellen Datums als ISO-String
const nowISO = () => new Date().toISOString()

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Inhalt')
    .items([
      // ==================== WEBSITE-EINSTELLUNGEN ====================
      S.listItem()
        .title('Website-Einstellungen')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Website-Einstellungen')
        ),

      S.divider(),

      // ==================== MITTEILUNGEN ====================
      S.listItem()
        .title('Mitteilungen')
        .icon(BellIcon)
        .child(
          S.list()
            .title('Mitteilungen')
            .items([
              // Alle Mitteilungen
              S.listItem()
                .title('Alle Mitteilungen')
                .icon(BellIcon)
                .child(
                  S.documentList()
                    .title('Alle Mitteilungen')
                    .filter('_type == "announcement"')
                    .defaultOrdering([{field: 'priority', direction: 'desc'}])
                ),

              S.divider(),

              // Aktive Mitteilungen
              S.listItem()
                .title('Aktive Mitteilungen')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Aktive Mitteilungen')
                    .filter(
                      `_type == "announcement" 
                       && isActive == true 
                       && (!defined(startDate) || startDate <= now())
                       && (!defined(endDate) || endDate >= now())`
                    )
                    .defaultOrdering([{field: 'priority', direction: 'desc'}])
                ),

              // Geplante Mitteilungen
              S.listItem()
                .title('Geplante Mitteilungen')
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title('Geplante Mitteilungen')
                    .filter(
                      `_type == "announcement" 
                       && isActive == true 
                       && defined(startDate) 
                       && startDate > now()`
                    )
                    .defaultOrdering([{field: 'startDate', direction: 'asc'}])
                ),

              // Abgelaufene Mitteilungen
              S.listItem()
                .title('Abgelaufene Mitteilungen')
                .icon(CloseCircleIcon)
                .child(
                  S.documentList()
                    .title('Abgelaufene Mitteilungen')
                    .filter(
                      `_type == "announcement" 
                       && defined(endDate) 
                       && endDate < now()`
                    )
                    .defaultOrdering([{field: 'endDate', direction: 'desc'}])
                ),

              // Inaktive Mitteilungen (Entwürfe)
              S.listItem()
                .title('Inaktive Mitteilungen')
                .child(
                  S.documentList()
                    .title('Inaktive Mitteilungen')
                    .filter('_type == "announcement" && isActive != true')
                    .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                ),
            ])
        ),

      S.divider(),

      // ==================== BLOG ====================
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Beiträge'),
              S.documentTypeListItem('author').title('Autoren'),
              S.documentTypeListItem('category').title('Kategorien'),
            ])
        ),

      // ==================== KARRIERE ====================
      S.documentTypeListItem('jobPosting').title('Stellenanzeigen'),

      S.divider(),

      // Alle anderen Dokumenttypen (falls vorhanden)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['siteSettings', 'announcement', 'post', 'author', 'category', 'jobPosting'].includes(
            listItem.getId() ?? ''
          )
      ),
    ])
