"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
      fetch("/api/posts")
        .then((res) => res.json())
        .then((data) => setPosts(data.posts || []));
    }
  }, [router]);

  const handleCommentSubmit = async (postId) => {
    if (!newComment) return;

    try {
      const response = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          user: user.name,
          content: newComment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Comentario agregado");
        setNewComment("");
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, data.comment] }
              : post
          )
        );
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error al agregar el comentario");
    }
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="home-container">
      <h1>Bienvenido, {user.name}</h1>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>
              <strong>Fecha:</strong> {new Date(post.date).toLocaleString()}
            </p>
            <p>
              <strong>Autor:</strong> {post.author}
            </p>
            <div>
              <h4>Comentarios:</h4>
              <ul>
                {post.comments.map((comment, index) => (
                  <li key={index}>
                    <p>{comment.content}</p>
                    <p>
                      <small>
                        Por {comment.user} el{" "}
                        {new Date(comment.date).toLocaleString()}
                      </small>
                    </p>
                  </li>
                ))}
              </ul>
              {user && (
                <div className="comment-form">
                  <textarea
                    placeholder="Escribe un comentario..."
                    value={currentPostId === post.id ? newComment : ""}
                    onChange={(e) => {
                      setCurrentPostId(post.id);
                      setNewComment(e.target.value);
                    }}
                  ></textarea>
                  <button onClick={() => handleCommentSubmit(post.id)}>
                    Agregar Comentario
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .home-container {
          padding: 20px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 20px;
        }
        .comment-form {
          margin-top: 10px;
        }
        textarea {
          width: 100%;
          height: 50px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
}
