'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Typography, Box, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import { format } from 'date-fns';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (params) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/login");
      } else {
        setUser(JSON.parse(storedUser));
        fetch(`/api/posts/${id}`)
          .then((res) => res.json())
          .then((data) => {
            // Convierte el Timestamp a una fecha de JavaScript
            if (data.date && data.date.seconds) {
              data.date = new Date(data.date.seconds * 1000);
            }
            setPost(data);
          })
          .catch((err) => console.error("Error fetching post:", err));
      }
    }
  }, [params, id, router]);

  const handleCommentSubmit = async () => {
    if (!newComment || post.commentsClosed) {
      alert(post.commentsClosed ? "Los comentarios están cerrados para este post." : "Por favor, ingrese un comentario.");
      return;
    }

    try {
      const response = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
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

  if (!post) return <Typography variant="h6" color="textSecondary">Cargando...</Typography>;

  return (
    <Container
      maxWidth="md"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "20px",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop: "50px",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
        {post.title}
      </Typography>
      <Typography variant="body1" color="textSecondary" style={{ marginBottom: "10px" }}>
        <strong>Autor:</strong> {post.author}
      </Typography>
      <Typography variant="body1" color="textSecondary" style={{ marginBottom: "20px" }}>
        <strong>Fecha:</strong> {post.date ? format(new Date(post.date), 'dd/MM/yyyy HH:mm:ss') : 'Fecha no disponible'}
      </Typography>
      <Typography variant="body1" style={{ marginBottom: "20px" }}>
        {post.content}
      </Typography>
      
      <Typography variant="h5" component="h3" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
        Comentarios
      </Typography>
      <Grid container spacing={3} style={{ marginBottom: "20px" }}>
        {post.comments && post.comments.map((comment, index) => (
          <Grid item xs={12} key={index}>
            <Card style={{ backgroundColor: "rgba(240, 255, 240, 0.9)", borderRadius: "8px" }}>
              <CardContent>
                <Typography variant="body1" gutterBottom style={{ color: "#555" }}>
                  {comment.content}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ color: "#777" }}>
                  Por {comment.user} el {comment.date && comment.date.seconds ? format(new Date(comment.date.seconds * 1000), 'dd/MM/yyyy HH:mm:ss') : 'Fecha no disponible'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {user && !post.commentsClosed && (
        <Box>
          <Typography variant="h6" component="h4" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
            Agregar Comentario
          </Typography>
          <TextField
            fullWidth
            placeholder="Escribe un comentario..."
            multiline
            minRows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            style={{ backgroundColor: "#ffffff", marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            style={{
              backgroundColor: "#88cc88", // Color pastel verde
              color: "#fff",
              marginRight: "10px",
            }}
            onClick={handleCommentSubmit}
          >
            Agregar Comentario
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#ffcc88", // Color pastel naranja
              color: "#fff",
            }}
            onClick={() => router.push("/")}
          >
            Volver a Home
          </Button>
        </Box>
      )}
      
      {post.commentsClosed && (
        <Typography variant="body1" color="textSecondary" style={{ marginTop: "20px" }}>
          Los comentarios están cerrados para este post.
        </Typography>
      )}
    </Container>
  );
}
