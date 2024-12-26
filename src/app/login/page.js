'use client'

import { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

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
        // Guardar usuario autenticado en localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        login(); // Actualizar estado de autenticación
        alert("Inicio de sesión exitoso");
        router.push("/"); // Redirigir a la página principal
      } else {
        setError(data.error); // Mostrar mensaje de error
        localStorage.removeItem("user"); // Asegurarse de que no se guarde un usuario no autenticado
      }
    } catch (err) {
      setError("Error al iniciar sesión");
      localStorage.removeItem("user"); // Asegurarse de que no se guarde un usuario no autenticado
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}
