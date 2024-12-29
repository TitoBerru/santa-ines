import { doc, getDoc } from 'firebase/firestore';
import { db } from "@/firebase/config";

export async function GET(req, { params }) {
  const { id } = await params;
  const docRef = doc(db, "POSTS", id);

  try {
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Post no encontrado" }), {
        status: 404,
      });
    }

    const postData = docSnap.data();
    console.log(postData);
    return new Response(JSON.stringify({ ...postData, id: docSnap.id }), {
     
      status: 200,
    });

  } catch (error) {
    console.error('Error al obtener el documento:', error);
    return new Response(JSON.stringify({ error: "Error al obtener el post" }), {
      status: 500,
    });
  }
}
