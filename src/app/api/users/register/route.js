import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src/data/users.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, lote } = body;

    if (!name || !email || !password || !lote) {
      return new Response(
        JSON.stringify({ success: false, error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    // Leer el archivo JSON existente
    let users = [];
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, "utf-8");
      users = JSON.parse(data);
    }

    // Verificar si el email ya existe
    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      return new Response(
        JSON.stringify({ success: false, error: "El email ya está registrado" }),
        { status: 400 }
      );
    }

    // Crear un nuevo usuario
    const newUser = {
      id: users.length + 1, // Generar un ID único
      name,
      email,
      password, // Contraseña sin encriptar, en un futuro podemos encriptarla con bcrypt
      lote,
      role: "user", // Rol predeterminado
    };

    // Agregar el nuevo usuario al array
    users.push(newUser);

    // Guardar el array actualizado en el archivo JSON
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf-8");

    return new Response(JSON.stringify({ success: true, user: newUser }), { status: 201 });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
