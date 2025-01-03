import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { Avatar, Menu, MenuItem, IconButton, Box } from '@mui/material';
import React, { useState } from 'react';
import Image from 'next/image'; // Importar el componente Image

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user && user.role === 'admin';

  const [anchorEl, setAnchorEl] = useState(null);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className={styles.navbar}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Link href="/">
          <Image
            src="/img/logo.webp"
            alt="Logo"
            width={40} // Proporcionar el ancho
            height={40} // Proporcionar la altura
            style={{ marginLeft: '10px' }}
          />
        </Link>
        <div className={styles.navContainer}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Publicaciones
              </Link>
            </li>
            {isAdmin && (
              <li className={styles.navItem}>
                <Link href="/posts" className={styles.navLink}>
                  Administrar
                </Link>
              </li>
            )}
          </ul>
        </div>
        {isAuthenticated && user && (
          <IconButton
            onClick={handleAvatarClick}
            style={{ marginRight: '10px' }}
          >
            <Avatar alt={user.name} src="/static/images/avatar/1.jpg" />
          </IconButton>
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
        </Menu>
      </Box>
    </nav>
  );
}
