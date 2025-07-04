import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lotties from "../components/Lotties";
import { supabase } from "../services/supabase";
const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const registrarUsuarioGoogle = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error obteniendo usuario:", error);
        return;
      }

      const { data: existente, error: errorConsulta } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id_auth", user.id)
        .single();

      if (!existente && errorConsulta.code !="") {
        // Insertar usuario google
        const { error: insertError } = await supabase.from("usuarios").insert([
          {
            nombre:
              user.user_metadata.full_name ||
              user.user_metadata.name ||
              "Sin nombre",
            correo: user.email,
            telefono: null,
            direccion: "",
            contraseña: "",
            id_rol: 1,
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

  return <Lotties fullScreen={false} mensaje="" />;
};

export default Callback;
