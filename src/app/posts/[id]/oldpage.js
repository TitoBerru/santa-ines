"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostDetail({ params }) {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data.post));
    }
  }, [id, router]);

  const handleCommentSubmit = async () => {
    if (!newComment) return;

    try {
      const response = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: id,
          user: user.name,
          content: newComment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Comentario agregado");
        setNewComment("");
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, data.comment],
        }));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error al agregar el comentario");
    }
  };

  if (!post) return <p>Cargando...</p>;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      <p><strong>Autor:</strong> {post.author}</p>
      <p><strong>Fecha:</strong> {new Date(post.date).toLocaleString()}</p>
      <p>{post.content}</p>
      <h3>Comentarios</h3>
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
      <textarea
        placeholder="Escribe un comentario..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <button onClick={handleCommentSubmit}>Agregar Comentario</button>
      <button onClick={() => router.push("/")}>Volver a Home</button>
      <style jsx>{`
        .post-detail {
          padding: 20px;
        }
        textarea {
          width: 100%;
          margin-top: 20px;
          height: 60px;
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          border: none;
          background-color: #0070f3;
          color: white;
          cursor: pointer;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}
