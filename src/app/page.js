"use client";

import { useState, useEffect } from "react";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import Navbar from "@/components/navbar";
import LoginForm from "@/components/LoginForm";
import PostList from "@/components/PostList";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const { user,  isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);


  console.log("linea 19 de page.js Estado actual del contexto: ", { user, isAuthenticated });
  
  useEffect(() => {

    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUserName(storedUser.name);
      }

      setLoading(true);
      const postRef = collection(db, "POSTS");
      const postQuery = query(postRef, orderBy("date", "desc"));
      getDocs(postQuery)
        .then((resp) =>
          setPosts(
            resp.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              date: doc.data().date?.seconds ? new Date(doc.data().date.seconds * 1000) : null,
            }))
          )
        )
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  return (
    <>
      <ToastContainer />
      {isAuthenticated && <Navbar />}
      <Container
        maxWidth={!isAuthenticated ? "sm" : "lg"}
        style={{
          textAlign: "center",
          padding: "50px",
          backgroundColor: isAuthenticated ? "rgba(240, 255, 240, 0.9)" : "rgba(255, 245, 238, 0.9)",
          borderRadius: "18px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          marginTop: "100px",
        }}
      >
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress />
            <Typography variant="body1" style={{ color: "#555" }}>
              Validando credenciales de usuario...
            </Typography>
          </Box>
        ) : !isAuthenticated ? (
          <LoginForm setLoading={setLoading} />
        ) : (
          <>
            <Box display="flex" alignItems="center" mb={3}>
              <Typography variant="h6" style={{ color: "#333", fontWeight: "bold" }}>
                Hola, {userName}, estos son los temas del día!
              </Typography>
            </Box>
            <PostList posts={posts} />
          </>
        )}
      </Container>
    </>
  );
}
