import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      name,
      email,
      lote,
      role: "user"
    });

    return new Response(
      JSON.stringify({ success: true, user: { uid: user.uid, email: user.email, name, lote, role: "user" } }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Error interno del servidor" }),
      { status: 500 }
    );
  }
}
