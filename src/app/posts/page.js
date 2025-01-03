"use client";

import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { Container, Typography, TextField, Button, Card, CardContent, CircularProgress, Box } from "@mui/material";
import styles from './Posts.module.css';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { db } from '../../firebase/config';

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadingAddPost, setLoadingAddPost] = useState(false);
  const [loadingDeletePost, setLoadingDeletePost] = useState({});
  const [loadingToggleComments, setLoadingToggleComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const postRef = collection(db, "POSTS");
      const postSnapshot = await getDocs(postRef);
      setPosts(postSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        date: doc.data().date && doc.data().date.seconds ? new Date(doc.data().date.seconds * 1000) : null,
        commentsClosed: doc.data().commentsClosed || false,
      })));
    };

    fetchPosts().catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handleAddPost = async () => {
    if (!title || !content) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    setLoadingAddPost(true);

    const newPost = {
      title,
      content,
      date: new Date(), // Agrega la fecha actual al nuevo post
      author: user.name,
      comments: [],
      commentsClosed: false, // Inicialmente los comentarios están abiertos
    };

    try {
      const postRef = collection(db, "POSTS");
      const docRef = await addDoc(postRef, newPost);
      setPosts([...posts, { ...newPost, id: docRef.id }]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error al agregar el post:", err);
      alert("Error al agregar el post: " + err.message);
    } finally {
      setLoadingAddPost(false);
    }
  };

  const handleDeletePost = async (id) => {
    setLoadingDeletePost((prev) => ({ ...prev, [id]: true }));

    try {
      const postRef = doc(db, "POSTS", id);
      await deleteDoc(postRef);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error("Error al eliminar el post:", err);
      alert("Error al eliminar el post: " + err.message);
    } finally {
      setLoadingDeletePost((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleToggleComments = async (id, commentsClosed) => {
    setLoadingToggleComments((prev) => ({ ...prev, [id]: true }));

    try {
      const postRef = doc(db, "POSTS", id);
      await updateDoc(postRef, { commentsClosed: !commentsClosed });
      setPosts(posts.map(post => 
        post.id === id ? { ...post, commentsClosed: !commentsClosed } : post
      ));
    } catch (err) {
      console.error("Error al actualizar el estado de los comentarios:", err);
      alert("Error al actualizar el estado de los comentarios: " + err.message);
    } finally {
      setLoadingToggleComments((prev) => ({ ...prev, [id]: false }));
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
        Administrar Publicaciones
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
        <Box display="flex" alignItems="center" justifyContent="center">
          <Button
            variant="contained"
            onClick={handleAddPost}
            style={{
              backgroundColor: "#88cc88", // Color pastel verde
              color: "#fff",
              padding: "10px 20px",
              fontWeight: "bold",
            }}
            disabled={loadingAddPost}
          >
            Crear nueva Publicacion
          </Button>
          {loadingAddPost && (
            <Box display="flex" alignItems="center" marginLeft="10px">
              <CircularProgress size={24} style={{ color: "#88cc88" }} />
              <Typography variant="body2" style={{ marginLeft: "10px", color: "#88cc88" }}>
                Agregando publicacion...
              </Typography>
            </Box>
          )}
        </Box>
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
                <Box display="flex" alignItems="center" justifyContent="center" marginTop="10px">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeletePost(post.id)}
                    style={{
                      backgroundColor: "#ff8888", // Color pastel rojo
                      color: "#fff",
                    }}
                    disabled={loadingDeletePost[post.id]}
                  >
                    Eliminar
                  </Button>
                  {loadingDeletePost[post.id] && (
                    <Box display="flex" alignItems="center" marginLeft="10px">
                      <CircularProgress size={24} style={{ color: "#ff8888" }} />
                      <Typography variant="body2" style={{ marginLeft: "10px", color: "#ff8888" }}>
                        Borrando publicacion...
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleToggleComments(post.id, post.commentsClosed)}
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    backgroundColor: post.commentsClosed ? "#ffcc88" : "#88ccff", // Color diferente según el estado de los comentarios
                    color: "#fff",
                  }}
                  disabled={loadingToggleComments[post.id]}
                >
                  {post.commentsClosed ? "Abrir Comentarios" : "Cerrar Comentarios"}
                  {loadingToggleComments[post.id] && (
                    <CircularProgress size={20} style={{ marginLeft: "10px", color: "#fff" }} />
                  )}
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Container>
  );
}
