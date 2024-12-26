"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Obtener los posts
      fetch("/api/posts")
        .then((res) => res.json())
        .then((data) => setPosts(data.posts || []));
    }
  }, []);

  if (!user) {
    return (
      <div className="home-container">
        <h1>Bienvenido a la App de Posts</h1>
        <p>Por favor, inicia sesión para visualizar los posts y comentarios.</p>
        <Link href="/login">
          <button>Iniciar Sesión</button>
        </Link>
        <style jsx>{`
          .home-container {
            text-align: center;
            padding: 50px;
          }
          button {
            padding: 10px 20px;
            background-color: #0070f3;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Bienvenido, {user.name}</h1>
      <h2>Posts</h2>
      <div className="posts-grid">
        {posts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => router.push(`/posts/${post.id}`)}
          >
            <h3>{post.title}</h3>
            <p><strong>Autor:</strong> {post.author}</p>
            <p><strong>Fecha:</strong> {new Date(post.date).toLocaleString()}</p>
            <p>
              <strong>Último comentario:</strong>{" "}
              {post.comments.length > 0
                ? post.comments[post.comments.length - 1].content
                : "Sin comentarios"}
            </p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .home-container {
          padding: 20px;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .post-card {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 5px;
          cursor: pointer;
          background-color:rgb(200, 21, 21);
          transition: box-shadow 0.3s ease;
        }
        .post-card:hover {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
