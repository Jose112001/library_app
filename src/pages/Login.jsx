import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarReenvio, setMostrarReenvio] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", email);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Resultado de login:", { loginError });
    if (loginError) {
      setMensaje("❌ " + loginError.message);
      return;
    }

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data?.user) {
      setMensaje("❌ No se pudo obtener la información del usuario.");
      return;
    }

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      setMensaje("⚠️ Debes confirmar tu correo electrónico para iniciar sesión.");
      setMostrarReenvio(true);
      return;
    }

    setMensaje("✅ Inicio de sesión exitoso.");
    setMostrarReenvio(false);
    setTimeout(() => navigate("/"), 2000);
  };


  
  const reenviarConfirmacion = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setMensaje("❌ Error al reenviar el correo: " + error.message);
    } else {
      setMensaje("📧 Correo de confirmación reenviado.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>

        {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}

        {mostrarReenvio && (
          <button
            type="button"
            onClick={reenviarConfirmacion}
            className="text-sm text-blue-600 underline mt-2"
          >
            Reenviar correo de confirmación
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
