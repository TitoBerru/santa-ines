"use client"; // Asegura que este componente se renderice en el cliente

import { useState } from "react";
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation"; // Cambiado a 'next/navigation'

export default function PostList({ posts }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePostClick = (postId) => {
    setLoading(true); // Activar el spinner
  
    // Navegar a la página del post
    router.push(`/posts/${postId}`);
  
    // Desactivar el spinner después de un corto retraso (para esperar la navegación)
    setLoading(false);
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
        <CircularProgress />
        <Typography variant="body1" style={{ color: "#555" }}>
          Accediendo al post...
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Card
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              height: "250px",
              overflow: "hidden",
            }}
            onClick={() => handlePostClick(post.id)}
          >
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom style={{ color: "#333" }}>
                {post.title}
              </Typography>
              <Typography variant="body2" style={{ color: "#555" }}>
                <strong>Autor:</strong> {post.author}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
