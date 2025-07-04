import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const registrarUsuarioGoogle = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error obteniendo usuario:", error);
        return;
      }

      // Verifica si ya existe en la tabla 'usuarios'
      const { data: existente, error: errorConsulta } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id_auth", user.id)
        .single();

      if (!existente && !errorConsulta) {
        // Insertar nuevo usuario
        const { error: insertError } = await supabase.from("usuarios").insert([
          {
            nombre: user.user_metadata.full_name || user.user_metadata.name || "Sin nombre",
            correo: user.email,
            telefono: null,
            direccion: "",
            contrasena: "", // Como viene por Google, queda vacía
            id_rol: 1, // Suponiendo que 1 es lector
            fecha_registro: new Date().toISOString(),
            id_auth: user.id,
          },
        ]);

        if (insertError) {
          console.error("Error al registrar usuario:", insertError.message);
        } else {
          console.log("✅ Usuario registrado por Google");
        }
      }

      navigate("/"); // Redirige a inicio
    };

    registrarUsuarioGoogle();
  }, [navigate]);

  return <p>⏳ Validando sesión con Google...</p>;
};

export default Callback;
