"use client";

import { useEffect, useState } from "react";

export default function Posts() {
  const [user, setUser] = useState(null); // Usuario autenticado
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simula obtener datos de usuario autenticado (puede ser desde un estado global o localStorage)
    const userData = {
      name: "Admin User",
      email: "admin@example.com",
    };
    setUser(userData);

    // Simula obtener datos de posts (puedes reemplazar esto con datos reales más adelante)
    setPosts([
      { id: 1, title: "Primer Post", content: "Contenido del primer post." },
      { id: 2, title: "Segundo Post", content: "Contenido del segundo post." },
    ]);
  }, []);

  return (
    <div className="posts-container">
      <h1>Posts</h1>
      {user && (
        <div className="user-info">
          <img
            src="/avatar-placeholder.png"
            alt="Avatar"
            className="avatar"
            title={`Usuario: ${user.name}`}
          />
        </div>
      )}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .posts-container { /* Estilos generales */ }
        .user-info {
          position: fixed;
          bottom: 20px;
          left: 20px;
          display: flex;
          align-items: center;
        }
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
        }
        .avatar:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
}
