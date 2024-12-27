import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const isAdmin = user && user.role === 'admin';

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>Home</Link>
          </li>
          {isAdmin && (
            <li className={styles.navItem}>
              <Link href="/posts" className={styles.navLink}>Posts</Link>
            </li>
          )}
          {!isAuthenticated ? (
            <li className={styles.navItem}>
              <Link href="/login" className={styles.navLink}>Login</Link>
            </li>
          ) : (
            <li className={styles.navItem}>
              <button onClick={logout} className={`${styles.navLink} ${styles.navButton}`}>Cerrar Sesión</button>
            </li>
          )}
        </ul>
        {isAuthenticated && user && (
          <span className={styles.userName}>Hola, {user.name}</span>
        )}
      </div>
    </nav>
  );
}
