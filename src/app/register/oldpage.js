"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button } from "@mui/material";



export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    lote: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registro exitoso");
        router.push("/");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Ocurrió un error", err);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        textAlign: "center",
        padding: "50px",
        backgroundColor: "rgba(255, 245, 238, 0.9)", // Fondo pastel con transparencia
        borderRadius: "18px",
        backdropFilter: "blur(10px)",
        marginTop: "auto", // Ajuste para centrar verticalmente
        marginBottom: "auto", // Ajuste para centrar verticalmente
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom style={{ color: "#333", fontWeight: "bold" }}>
        Registro
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TextField
          type="text"
          label="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          variant="outlined"
          style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
        />
        <TextField
          type="text"
          label="Lote"
          value={form.lote}
          onChange={(e) => setForm({ ...form, lote: e.target.value })}
          required
          variant="outlined"
          style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
        />
        <TextField
          type="email"
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          variant="outlined"
          style={{ backgroundColor: "#fff", marginBottom: "20px", width: "100%" }}
        />
        <TextField
          type="password"
          label="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            marginBottom: "20px",
          }}
        >
          Registrarse
        </Button>
      </form>
    </Container>
  );
}
