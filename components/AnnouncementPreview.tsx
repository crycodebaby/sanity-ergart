/**
 * AnnouncementPreview – Visuelle Vorschau-Komponente für Sanity Studio
 *
 * Zeigt dem Benutzer, wie die Mitteilung auf der Website aussehen wird,
 * basierend auf dem gewählten Placement, Typ und Inhalt.
 */
import {Card, Stack, Text, Badge, Flex, Box} from '@sanity/ui'
import {InfoOutlineIcon, WarningOutlineIcon, CheckmarkCircleIcon, SparklesIcon, CloseIcon} from '@sanity/icons'
import styled from 'styled-components'

// Typen für die Vorschau
type AnnouncementType = 'info' | 'warning' | 'success' | 'promo'
type PlacementType = 'topbar' | 'banner' | 'inline'

interface AnnouncementPreviewProps {
  document: {
    displayed: {
      title?: string
      message?: string
      type?: AnnouncementType
      placement?: PlacementType
      cta?: {
        text?: string
        url?: string
      }
      isActive?: boolean
    }
  }
}

// Styled Components für die Vorschau
const PreviewContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
`

const TopBarPreview = styled.div<{$bgColor: string; $textColor: string}>`
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0;
  font-size: 14px;
  position: relative;
`

const BannerPreview = styled.div<{$bgColor: string; $textColor: string}>`
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};
  padding: 1.5rem 2rem;
  border-radius: 0;
  font-size: 15px;
  text-align: center;
`

const InlineCardPreview = styled.div<{$bgColor: string; $borderColor: string; $textColor: string}>`
  background: ${(props) => props.$bgColor};
  color: ${(props) => props.$textColor};
  border: 2px solid ${(props) => props.$borderColor};
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  font-size: 14px;
`

const MockHeader = styled.div`
  background: #1a1a1a;
  color: white;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MockContent = styled.div`
  background: white;
  padding: 2rem;
  min-height: 100px;
  color: #666;
  font-size: 13px;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  color: currentColor;
`

const CTAButton = styled.span`
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 0.5rem;
`

// Farbschemata für die verschiedenen Typen
const COLORS = {
  info: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    text: '#1e40af',
  },
  warning: {
    bg: '#fffbeb',
    border: '#fcd34d',
    text: '#92400e',
  },
  success: {
    bg: '#f0fdf4',
    border: '#86efac',
    text: '#166534',
  },
  promo: {
    bg: '#faf5ff',
    border: '#d8b4fe',
    text: '#7c3aed',
  },
}

// Icons für die verschiedenen Typen
const ICONS = {
  info: InfoOutlineIcon,
  warning: WarningOutlineIcon,
  success: CheckmarkCircleIcon,
  promo: SparklesIcon,
}

export function AnnouncementPreview(props: AnnouncementPreviewProps) {
  const {displayed} = props.document
  const {title, message, type = 'info', placement = 'topbar', cta, isActive} = displayed

  const colors = COLORS[type] || COLORS.info
  const Icon = ICONS[type] || ICONS.info

  // Platzierungslabels
  const placementLabels = {
    topbar: 'Schmale Leiste ganz oben',
    banner: 'Großes Banner unter Kopfbereich',
    inline: 'Hinweis-Kasten im Textbereich',
  }

  return (
    <PreviewContainer>
      <Stack space={4}>
        {/* Status-Anzeige */}
        <Flex align="center" gap={2}>
          <Badge tone={isActive ? 'positive' : 'default'}>
            {isActive ? 'Aktiv' : 'Inaktiv'}
          </Badge>
          <Text size={1} muted>
            Vorschau: {placementLabels[placement]}
          </Text>
        </Flex>

        {/* Visuelle Vorschau */}
        <Card shadow={2} radius={2} style={{overflow: 'hidden'}}>
          {/* TopBar Placement */}
          {placement === 'topbar' && (
            <>
              <TopBarPreview $bgColor={colors.bg} $textColor={colors.text}>
                <Icon style={{flexShrink: 0}} />
                <div style={{flex: 1}}>
                  {title && <strong>{title}: </strong>}
                  {message || 'Keine Nachricht eingegeben'}
                  {cta?.text && <CTAButton>{cta.text} →</CTAButton>}
                </div>
                <CloseButton>
                  <CloseIcon />
                </CloseButton>
              </TopBarPreview>
              <MockHeader>
                <span>🏠 Ergart Hausmeisterservice</span>
                <span>≡ Menü</span>
              </MockHeader>
              <MockContent>
                <em>Hier kommt der Seiteninhalt...</em>
              </MockContent>
            </>
          )}

          {/* Banner Placement */}
          {placement === 'banner' && (
            <>
              <MockHeader>
                <span>🏠 Ergart Hausmeisterservice</span>
                <span>≡ Menü</span>
              </MockHeader>
              <BannerPreview $bgColor={colors.bg} $textColor={colors.text}>
                <Flex align="center" justify="center" gap={3}>
                  <Icon style={{width: 24, height: 24}} />
                  <div>
                    {title && (
                      <div style={{fontWeight: 600, fontSize: '16px', marginBottom: '4px'}}>
                        {title}
                      </div>
                    )}
                    <div>{message || 'Keine Nachricht eingegeben'}</div>
                    {cta?.text && (
                      <CTAButton style={{display: 'inline-block', marginTop: '8px'}}>
                        {cta.text} →
                      </CTAButton>
                    )}
                  </div>
                </Flex>
              </BannerPreview>
              <MockContent>
                <em>Hier kommt der Seiteninhalt...</em>
              </MockContent>
            </>
          )}

          {/* Inline Card Placement */}
          {placement === 'inline' && (
            <>
              <MockHeader>
                <span>🏠 Ergart Hausmeisterservice</span>
                <span>≡ Menü</span>
              </MockHeader>
              <MockContent>
                <div style={{marginBottom: '1rem'}}>
                  <em>Seiteninhalt oberhalb...</em>
                </div>
                <InlineCardPreview
                  $bgColor={colors.bg}
                  $borderColor={colors.border}
                  $textColor={colors.text}
                >
                  <Flex align="flex-start" gap={3}>
                    <Icon style={{flexShrink: 0, marginTop: '2px'}} />
                    <div style={{flex: 1}}>
                      {title && (
                        <div style={{fontWeight: 600, marginBottom: '4px'}}>{title}</div>
                      )}
                      <div>{message || 'Keine Nachricht eingegeben'}</div>
                      {cta?.text && (
                        <CTAButton style={{display: 'inline-block', marginTop: '8px'}}>
                          {cta.text} →
                        </CTAButton>
                      )}
                    </div>
                  </Flex>
                </InlineCardPreview>
                <div style={{marginTop: '1rem'}}>
                  <em>Seiteninhalt unterhalb...</em>
                </div>
              </MockContent>
            </>
          )}
        </Card>

        {/* Info-Text */}
        <Text size={1} muted>
          So wird die Mitteilung ungefähr auf der Website aussehen.
        </Text>
      </Stack>
    </PreviewContainer>
  )
}
