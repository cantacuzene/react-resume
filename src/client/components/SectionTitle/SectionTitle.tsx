import styles from './SectionTitle.module.css'

export type SectionTitleProps = Readonly<{ text: string }>

export const SectionTitle = ({ text }: SectionTitleProps) => (
  <h2 className={styles.title}>{text}</h2>
)
