import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/posts" className={styles.navLink}>Posts</Link>
        </li>
        {!isAuthenticated ? (
          <li className={styles.navItem}>
            <Link href="/login" className={styles.navLink}>Login</Link>
          </li>
        ) : (
          <li className={styles.navItem}>
            <button onClick={logout} className={styles.navButton}>Cerrar Sesión</button>
          </li>
        )}
      </ul>
      {isAuthenticated && (
        <img src="/img/avatars/avatar-placeholder.png" alt="User Avatar" className={styles.avatar} />
      
      ) && <p>texto prueba</p>}
    </nav>
  );
}
