import { auth, db } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "auth/missing-fields" }),
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return new Response(
        JSON.stringify({ success: false, error: "auth/user-not-found" }),
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const fullUser = {
      uid: user.uid,
      email: user.email,
      ...userData,
    };

    return new Response(JSON.stringify({ success: true, user: fullUser }), {
      status: 200,
    });
  } catch (error) {
    console.error(
      "Error al iniciar sesión del usuario:",
      error
    );

    // Manejo de errores específicos de Firebase
    let errorMessage;
    switch (error.code) {
      case "auth/invalid-credential":
        errorMessage = "Credenciales inválidas. Por favor, verifica tu información.";
        break;
      case "auth/user-not-found":
        errorMessage = "Usuario no encontrado. Por favor, verifica tu email.";
        break;
      case "auth/wrong-password":
        errorMessage = "Contraseña incorrecta. Por favor, intenta de nuevo.";
        break;
      default:
        errorMessage = "Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.";
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { status: 500 }
    );
  }
}
