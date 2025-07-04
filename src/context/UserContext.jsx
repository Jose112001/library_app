import { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);

  const cargarUsuarioConRol = async (userAuth) => {
    console.log(userAuth);
    if (!userAuth) {
      setRolUsuario(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id_usuario, nombre, id_rol")
        .eq("id_auth", userAuth.id)
        .single();

      console.log("respuesta data", data);
      console.log("respuesta error", error);

      if (error) {
        console.error("❌ Error al cargar datos del usuario:", error.message);
        setRolUsuario({ ...data });
      } else {
        setRolUsuario({ ...data });
      }
    } catch (err) {
      console.error("❗ Excepción al consultar el usuario con rol:", err);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUsuario(user);
      setRolUsuario(cargarUsuarioConRol(user));
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        await setUsuario(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };


  return (
    <UserContext.Provider
      value={{ usuario, setUsuario, rolUsuario, setRolUsuario, handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};
