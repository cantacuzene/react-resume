import { pdf } from '@react-pdf/renderer'
import { ResumePdf } from './ResumePdf'
import type { ResumeBlock } from './resumeDocument.utils'

// Loaded on demand (the renderer is heavy), so this module stays a single call
export const renderResumePdf = (blocks: ReadonlyArray<ResumeBlock>, title: string): Promise<Blob> =>
  pdf(<ResumePdf blocks={blocks} title={title} />).toBlob()
