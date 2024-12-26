import styles from './Navbar.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/" className={styles.navLink}>Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/posts" className={styles.navLink}>Posts</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/login" className={styles.navLink}>Login</Link>
        </li>
        <li className={styles.navItem}>
          <button onClick={handleLogout} className={styles.navButton}>Cerrar Sesión</button>
        </li>
      </ul>
      <img src="img/avatars/avatar-placeholder.png" alt="User Avatar" className={styles.avatar} />
    </nav>
  );
}
