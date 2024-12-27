import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2024 Design by
      <a href="https://www.sigitech.com.ar" target="_blank" rel="noopener noreferrer" className={styles.footerLink}> SIGITECH </a>
      para todos los propietarios de Santa Ines. Todos los derechos reservados.</p>
    </footer>
  );
}
