import type { Education as EducationEntry } from '@/client/api/types'
import { SectionTitle } from '@/client/components/SectionTitle/SectionTitle'
import styles from './Education.module.css'

export type EducationProps = Readonly<{
  educations: ReadonlyArray<EducationEntry>
  title: string
}>

export const Education = ({ educations, title }: EducationProps) => (
  <section className={styles.education}>
    <SectionTitle text={title} />
    {educations.map(({ id, year, school, title: degree, location }) => (
      <div key={id}>
        <div className={styles.school}>
          <span className={styles.year}>{year}</span>
          <span>{school}</span>
        </div>
        <div className={styles.degree}>
          <p>{degree}</p>
          <i className={styles.location}>{location}</i>
        </div>
      </div>
    ))}
  </section>
)
