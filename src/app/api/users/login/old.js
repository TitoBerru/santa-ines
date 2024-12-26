import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src/data/users.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Email y contraseña son obligatorios" }),
        { status: 400 }
      );
    }

    // Leer el archivo JSON existente
    const data = fs.readFileSync(usersFile, "utf-8");
    const users = JSON.parse(data);

    // Verificar si el usuario existe
    const user = users.find((u) => u.email === email);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Usuario no encontrado" }),
        { status: 404 }
      );
    }

    // Verificar la contraseña (sin bcrypt en este ejemplo)
    if (user.password !== password) {
      return new Response(
        JSON.stringify({ success: false, error: "Contraseña incorrecta" }),
        { status: 401 }
      );
    }

    // Devolver el usuario autenticado
    return new Response(
      JSON.stringify({ success: true, user: { id: user.id, name: user.name, role: user.role } }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
