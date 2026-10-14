import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { blockKey, bulletLine, contactLine, entryHeadline, fieldLabel } from './pdfLines.utils'
import type { ResumeBlock } from './resumeDocument.utils'

export type ResumePdfProps = Readonly<{ blocks: ReadonlyArray<ResumeBlock>; title: string }>

// One column, no decoration: the point of this document is a text layer in reading order
const styles = StyleSheet.create({
  page: { paddingVertical: 40, paddingHorizontal: 48, fontSize: 10, lineHeight: 1.5 },
  name: { fontSize: 22 },
  jobTitle: { fontSize: 12, marginTop: 2 },
  contact: { fontSize: 9, marginTop: 2 },
  heading: { fontSize: 14, marginTop: 18, marginBottom: 6 },
  paragraph: { marginBottom: 4 },
  item: { marginBottom: 2 },
  entry: { marginBottom: 10 },
  entryTitle: { fontSize: 11 },
  entryDates: { fontSize: 9, marginBottom: 2 },
  fieldLabel: { fontSize: 9 },
})

const Block = ({ block }: Readonly<{ block: ResumeBlock }>) => {
  switch (block.kind) {
    case 'title':
      return (
        <View>
          <Text style={styles.name}>{block.text}</Text>
          <Text style={styles.jobTitle}>{block.subtitle}</Text>
          <Text style={styles.contact}>{contactLine(block.contact)}</Text>
        </View>
      )
    case 'heading':
      return <Text style={styles.heading}>{block.text}</Text>
    case 'paragraph':
      return <Text style={styles.paragraph}>{block.text}</Text>
    case 'list':
      return (
        <View>
          {block.items.map((item) => (
            <Text key={item} style={styles.item}>
              {bulletLine(item)}
            </Text>
          ))}
        </View>
      )
    case 'entry':
      return (
        <View style={styles.entry} wrap={false}>
          <Text style={styles.entryTitle}>{entryHeadline(block)}</Text>
          <Text style={styles.entryDates}>{block.dates}</Text>
          {block.fields.map((field) => (
            <Text key={field.label} style={styles.item}>
              <Text style={styles.fieldLabel}>{fieldLabel(field)}</Text>
              {field.value}
            </Text>
          ))}
        </View>
      )
  }
}

export const ResumePdf = ({ blocks, title }: ResumePdfProps) => (
  <Document title={title}>
    <Page size="A4" style={styles.page}>
      {blocks.map((block, index) => (
        <Block key={blockKey(block, index)} block={block} />
      ))}
    </Page>
  </Document>
)
