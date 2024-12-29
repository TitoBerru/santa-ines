import fs from "fs";
import path from "path";

const postsFile = path.join(process.cwd(), "src/data/posts.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, user, content } = body;

    if (!postId || !user || !content) {
      return new Response(
        JSON.stringify({ success: false, error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    // Leer el archivo JSON existente
    let posts = [];
    if (fs.existsSync(postsFile)) {
      const data = fs.readFileSync(postsFile, "utf-8");
      posts = JSON.parse(data);
    }

    // Encontrar el post correspondiente
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) {
      return new Response(
        JSON.stringify({ success: false, error: "Post no encontrado" }),
        { status: 404 }
      );
    }

    // Agregar el nuevo comentario
    const newComment = {
      user,
      date: new Date().toISOString(),
      content,
    };

    posts[postIndex].comments.push(newComment);

    // Guardar los cambios en el archivo JSON
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf-8");

    return new Response(JSON.stringify({ success: true, comment: newComment }), { status: 201 });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
