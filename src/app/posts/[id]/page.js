'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Grid, Container, Typography, Box, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { format } from 'date-fns';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loadingComment, setLoadingComment] = useState(false); // Nuevo estado para el spinner

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
      return; // No hacemos nada si no hay comentario o si los comentarios están cerrados
    }

    setLoadingComment(true); // Activar el spinner mientras se envía el comentario

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
        setNewComment(""); // Limpiar el comentario
        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, data.comment],
        }));
      } else {
        console.error(data.error); // Manejamos el error de forma más limpia
      }
    } catch (err) {
      console.error("Error al agregar el comentario", err);
    } finally {
      setLoadingComment(false); // Desactivar el spinner después de procesar el comentario
    }
  };

  if (!post) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
        <CircularProgress />
        <Typography variant="body1" style={{ color: "#555" }}>
          Cargando post...
        </Typography>
      </Box>
    );
  }

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
        <strong>Fecha:</strong> {post.date ? format(new Date(post.date), 'dd/MM/yyyy HH:mm:ss') : 'Hace momentos...'}
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
                  Por {comment.user} - {comment.date && comment.date.seconds ? format(new Date(comment.date.seconds * 1000), 'dd/MM/yyyy HH:mm:ss') : 'Hace momentos...'}
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
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#88cc88", // Color pastel verde
                color: "#fff",
                marginRight: "10px",
              }}
              onClick={handleCommentSubmit}
              disabled={loadingComment} // Desactivar el botón mientras se está enviando el comentario
            >
              Agregar Comentario
            </Button>
            {loadingComment &&( 
              <Box display="flex" alignItems="center">
              <CircularProgress size={24} style={{ color: "#88cc88", marginLeft: "10px" }} /> 
              <Typography variant="body2" style={{ marginLeft: "10px", color: "#88cc88" }}>
                 Agregando comentario... 
                 </Typography>
                </Box>
            )}
          </Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#ffcc88", // Color pastel naranja
              color: "#fff",
              marginTop: "10px",
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
