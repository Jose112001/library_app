import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const validarPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>/?\\|`~=-]).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarPassword(password)) {
      setMensaje(
        "⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
      );
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMensaje("❌ Error al crear usuario: " + error.message);
      return;
    }
    const user = data.user;
    if (!user) {
      setMensaje("⚠️ Falta confirmar tu correo para guardar tu perfil.");
      return;
    }
    if (password !== confirmPassword) {
      setMensaje("⚠️ Las contraseñas no coinciden.");
      return;
    }
    console.log(user);
    const { error: insertError } = await supabase.from("usuarios").insert([
      {
        nombre,
        telefono,
        direccion,
        correo: email,
        contraseña: password,
        id_rol: 1,
        id_auth: user_id
      },
    ]);

    if (insertError) {
      setMensaje("❌ Error al guardar perfil: " + insertError.message);
    } else {
      setMensaje("✅ Registro completo. Revisa tu correo para confirmar.");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
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
        <p className="text-xs text-gray-500 mt-1">
          La contraseña debe tener mínimo 8 caracteres, una mayúscula, una
          minúscula, un número y un símbolo.
        </p>
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
        {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
      </form>
    </div>
  );
};

export default Register;
