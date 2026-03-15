import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr className={styles.divider} />
      <p className={styles.copy}>© 2026 AIJob. All rights reserved.</p>
    </footer>
  )
}
