import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export async function POST(req) {
  try {
    const body = await req.json();
    const { postId, user, content } = body;
    console.log(body)
    if (!postId || !user || !content) {
      return new Response(
        JSON.stringify({ success: false, error: "Todos los campos son obligatorios" }),
        { status: 400 }
      );
    }

    // Referencia al documento del post en Firestore
    const postRef = doc(db, "POSTS", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return new Response(
        JSON.stringify({ success: false, error: "Post no encontrado" }),
        { status: 404 }
      );
    }

    // Crear el nuevo comentario
    const newComment = {
      user,
      date: new Date(), // Timestamp en lugar de ISO string
      content,
    };

    // Agregar el comentario al array de comentarios en Firestore
    await updateDoc(postRef, {
      comments: arrayUnion(newComment)
    });

    return new Response(JSON.stringify({ success: true, comment: newComment }), { status: 201 });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
