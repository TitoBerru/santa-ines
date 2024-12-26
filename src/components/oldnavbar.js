import { useState, useEffect } from "react";
import styles from './Navbar.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user); // Actualiza el estado basado en la existencia de la clave `user`
    };

    checkAuthentication();

    // Escucha cambios en el localStorage
    window.addEventListener("storage", checkAuthentication);

    return () => {
      window.removeEventListener("storage", checkAuthentication);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
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
        {!isAuthenticated ? (
          <li className={styles.navItem}>
            <Link href="/login" className={styles.navLink}>Login</Link>
          </li>
        ) : (
          <li className={styles.navItem}>
            <button onClick={handleLogout} className={styles.navButton}>Cerrar Sesión</button>
          </li>
        )}
      </ul>
      {isAuthenticated && (
        <img src="/img/avatars/avatar-placeholder.png" alt="User Avatar" className={styles.avatar} />
      )}
    </nav>
  );
}
