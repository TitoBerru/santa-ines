"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { Container, Typography, Grid, Box, Card, CardContent, Button, TextField } from "@mui/material";
import Image from "next/image";
import Navbar from "@/components/Navbar"; // Importa el Navbar
import { collection, getDocs, orderBy, query } from "firebase/firestore"; 
import { db } from '../firebase/config';
import { format } from 'date-fns'; // Importa la librería date-fns

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try{
          const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name);
        } catch (error){
          console.error('Error al parsear el usuario almacenado:', error); // Maneja el caso en el que el JSON es inválido o no se puede parsear 
         localStorage.removeItem("user");
        }
        
      }

      const postRef = collection(db, "POSTS");
      const postQuery = query(postRef, orderBy("date", "desc")); // Ordena por fecha descendente
      getDocs(postQuery)
        .then((resp) => {
          setPosts(
            resp.docs.map((doc) => {
              const data = doc.data();
              return {
                ...data,
                id: doc.id,
                date: data.date && data.date.seconds ? new Date(data.date.seconds * 1000) : null,
                comments: data.comments ? data.comments.map(comment => ({
                  ...comment,
                  date: comment.date && comment.date.seconds ? new Date(comment.date.seconds * 1000) : null
                })) : []
              };
            })
          );
        });
    } else {
      setPosts([]);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Linea 73, page.js HOME - User data to be stored: ", data.user); // Verifica la estructura de los datos del usuario
        localStorage.setItem("user", JSON.stringify(data.user));
        login(data.user); // Pasa los datos del usuario al método login
        alert("Inicio de sesión exitoso");
        router.push("/");
      } else {
        setError(data.error);
        console.log('linea 80 page.js - HOME - ', data.error)
        localStorage.removeItem("user");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
      localStorage.removeItem("user");
    }
  };

  return (
    <>
      {isAuthenticated && <Navbar />} {/* Mostrar el Navbar solo si está autenticado */}
      <Container
        maxWidth={!isAuthenticated ? "sm" : "lg"} /* Ajustar tamaño del contenedor */
        style={{
          textAlign: "center",
          padding: "50px",
          backgroundColor: !isAuthenticated ? "rgba(255, 245, 238, 0.9)" : "rgba(240, 255, 240, 0.9)", // Fondo pastel con transparencia
          borderRadius: "18px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          marginTop: !isAuthenticated ? "100px" : "50px", // Ajustar margen superior
          position: "relative", // Añadir posición relativa
        }}
      >
        {!isAuthenticated ? (
          <>
            <div className="logo-container">
              <Image src="/img/logo.webp" alt="Logo" width={100} height={100} className="logo" />
            </div>
            <Typography variant="h4" component="h1" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
              Bienvenido a Santa Ines
            </Typography>
            <Typography variant="body1" gutterBottom style={{ color: "#555" }}>
              Por favor, inicia sesión para visualizar los temas del dia.
            </Typography>
            {error && <Typography variant="body1" style={{ color: 'red', marginBottom: "20px" }}>{error}</Typography>}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <TextField
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
              />
              <TextField
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
              />
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#88cc88", // Color pastel verde
                  color: "#fff",
                  padding: "10px 20px",
                  fontWeight: "bold",
                }}
              >
                Iniciar Sesión
              </Button>
              <div className="footer-text" style={{ 
                backgroundColor: "rgba(220, 220, 220, 0.5)", // Fondo diferencial
                borderRadius: "10px",
                marginTop: "30px", // Separación del botón
                padding: "10px 20px",
                width: "100%",
                textAlign: "center",
              }}>
                <Link href="/register" style={{ textDecoration: 'none', color: '#555' }}>
                  No tengo usuario
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="h6" component="h2" ml={2} style={{ color: "#333", fontWeight: "bold" }}>
                Hola, {userName}, estos son los temas del dia!
              </Typography>
            </Box>
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
                      height: "250px", // Altura fija para la tarjeta
                      overflow: "hidden",
                    }}
                    onClick={() => router.push(`/posts/${post.id}`)}
                  >
                    <CardContent>
                      <Typography variant="h6" component="h3" gutterBottom style={{ color: "#333" }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" style={{ color: "#555" }}>
                        <strong>Autor:</strong> {post.author}
                      </Typography>
                      <Typography variant="body2" style={{ color: "#555" }}>
                        <strong>Fecha:</strong> {post.date ? format(post.date, 'dd/MM/yyyy HH:mm:ss') : 'Fecha no disponible'}
                      </Typography>
                      <Typography variant="body2" style={{ color: "#777", height: "50px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        <strong>Último comentario:</strong>{" "}
                        {post.comments.length > 0
                          ? post.comments[post.comments.length - 1].content
                          : "Sin comentarios"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
