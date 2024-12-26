import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const usersFile = path.join(process.cwd(), "src", "data", "users.json");

export async function POST(req) {
  const { email, password } = await req.json();

  // Leer datos de usuarios
  let users = [];
try {
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  } else {
    console.error("El archivo users.json no existe.");
  }
} catch (error) {
  console.error("Error al leer el archivo users.json:", error);
  return new Response(JSON.stringify({ success: false, error: "Error interno del servidor" }), { status: 500 });
}

  // Buscar usuario por email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "Usuario no encontrado" }), { status: 404 });
  }

  // Verificar contraseña
  const match = password === user.password

  if(match){
    return new Response(JSON.stringify({ success: true, user: { id: user.id, name: user.name, role: user.role } }), {
      status: 200,
    });
  }else{

    return new Response(JSON.stringify({ success: false, error: "Contraseña incorrecta" }), { status: 401 });

  }


  // const isValid = await bcrypt.compare(password, user.password);
  // if (!isValid) {

  //   return new Response(JSON.stringify({ success: false, error: "Contraseña incorrecta" }), { status: 401 });
  // }

  // // Simulación de token (JWT sería más seguro en producción)
  // return new Response(JSON.stringify({ success: true, user: { id: user.id, name: user.name, role: user.role } }), {
  //   status: 200,
  // });
}
