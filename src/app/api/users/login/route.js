import { auth, db } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
      throw new Error("auth/user-not-found");
    }

    const userData = userDoc.data();
    const fullUser = {
      uid: user.uid,
      email: user.email,
      ...userData
    };

    return new Response(
      JSON.stringify({ success: true, user: fullUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al iniciar sesión del usuario:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.code || "auth/internal-error" }),
      { status: 500 }
    );
  }
}
