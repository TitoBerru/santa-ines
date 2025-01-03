import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al parsear el usuario almacenado:', error);
        localStorage.removeItem("user");
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("linea 28, AuthContext, Estado del usuario detectado por Firebase:", currentUser);

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
         
          console.log("Usuario final establecido en el contexto:", fullUser);

          const userData = userDoc.data();
          console.log("linea 28 authContext, Datos de usuario obtenidos del Firestore:", userData);
          setUser({ ...currentUser, ...userData });
          const fullUser = { uid: currentUser.uid, email: currentUser.email, ...userData};
          console.log("Line 41 Authcontext Usuario final establecido en el contexto:", fullUser);
          setUser(fullUser);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(fullUser));
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    console.log("Line 57 Authcontext Datos de usuario que se intentan establecer en el login:", userData);

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
