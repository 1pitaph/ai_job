import styles from './AboutSection.module.css'

export default function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <hr className={styles.divider} />
      <div className={styles.content}>
        <h2 className={styles.slogan}>
          Your Career,<br />
          <em>Powered by AI.</em>
        </h2>

      </div>
    </section>
  )
}
