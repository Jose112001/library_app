import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, Link } from "react-router-dom";
import animacionCarga from "../assets/lotties/loading_lottie.json";
import Lottie from "lottie-react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarReenvio, setMostrarReenvio] = useState(false);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const loginConGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setCargando(false);
      setMensaje("❌ " + loginError.message);
      return;
    }

    const { data, error: userError } = await supabase.auth.getUser();

    if (userError || !data?.user) {
      setCargando(false);
      setMensaje("❌ No se pudo obtener la información del usuario.");
      return;
    }

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      setCargando(false);
      setMensaje(
        "⚠️ Debes confirmar tu correo electrónico para iniciar sesión."
      );
      setMostrarReenvio(true);
      return;
    }

    setMensaje("✅ Inicio de sesión exitoso.");
    setMostrarReenvio(false);

    setTimeout(() => {
      navigate("/");
    }, 1500); // Tiempo para mostrar pantalla de carga
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

  if (cargando) {
    return (
      <div style={estiloLoading}>
        <Lottie
          animationData={animacionCarga}
          loop={true}
          style={{ height: 200 }}
        ></Lottie>
        <p>📚 Cargando biblioteca...</p>
      </div>
    );
  }

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
        <p className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
        <button
          onClick={loginConGoogle}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
        >
          Iniciar sesión con Google
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

const estiloLoading = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  fontSize: "1.3rem",
  textAlign: "center",
};

export default Login;
