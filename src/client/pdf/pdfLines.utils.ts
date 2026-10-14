import type { ResumeBlock, ResumeField } from './resumeDocument.utils'

// The PDF has no stylesheet, so the punctuation the web app renders with CSS ::before / ::after
// is part of the text here. It stays out of the JSX: components render, they do not format.
export const bulletLine = (item: string): string => `- ${item}`

export const contactLine = (contact: ReadonlyArray<string>): string => contact.join(' - ')

export const entryHeadline = ({ title, subtitle }: Readonly<{ title: string; subtitle: string }>) =>
  `${title}, ${subtitle}`

export const fieldLabel = ({ label }: ResumeField): string => `${label}: `

export const blockKey = (block: ResumeBlock, index: number): string =>
  `${block.kind}-${String(index)}`
