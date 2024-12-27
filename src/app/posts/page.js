"use client";

import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { Container, Typography, TextField, Button, Card, CardContent } from "@mui/material";
import styles from './Posts.module.css';

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch('/api/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching posts');
        }
        return response.json();
      })
      .then(data => setPosts(data.posts))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleAddPost = async () => {
    if (!title || !content) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    const newPost = { title, content };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding post:', errorData);
        alert("Error al agregar el post: " + errorData.message);
        return;
      }
      const data = await response.json();
      setPosts([...posts, data.post]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error al agregar el post:", err);
      alert("Error al agregar el post: " + err.message);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting post:', errorData);
        alert("Error al eliminar el post: " + errorData.message);
        return;
      }
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error("Error al eliminar el post:", err);
      alert("Error al eliminar el post: " + err.message);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Typography variant="h6" component="h2" style={{ color: 'red' }}>No tiene acceso a esta página.</Typography>;
  }

  return (
    <Container
      maxWidth="lg"
      style={{
        textAlign: "center",
        padding: "50px",
        backgroundColor: "rgba(240, 255, 240, 0.9)", // Fondo pastel con transparencia
        borderRadius: "18px",
        backdropFilter: "blur(10px)",
        marginTop: "50px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
        Administrar Posts
      </Typography>
      <div className={styles.formContainer}>
        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
        />
        <TextField
          label="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          multiline
          rows={4}
          style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
        />
        <Button
          variant="contained"
          onClick={handleAddPost}
          style={{
            backgroundColor: "#88cc88", // Color pastel verde
            color: "#fff",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          Agregar Post
        </Button>
      </div>
      <ul className={styles.postsList}>
        {posts.map(post => (
          <li key={post.id}>
            <Card
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
                overflow: "hidden",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h3" style={{ color: "#333" }}>
                  {post.title}
                </Typography>
                <Typography variant="body1" style={{ color: "#555" }}>
                  {post.content}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeletePost(post.id)}
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#ff8888", // Color pastel rojo
                    color: "#fff",
                  }}
                >
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Container>
  );
}
