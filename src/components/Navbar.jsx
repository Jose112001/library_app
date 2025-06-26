import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { supabase } from "../services/supabase";

const Navbar = () => {
  const { usuario } = useContext(UserContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // O redirige a login
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="font-bold">📚 Biblioteca</h1>
      <div className="flex items-center space-x-4">
        <Link to="/">Inicio</Link>
        <Link to="/libros">Libros</Link>
        <Link to="/prestamos">Préstamos</Link>
        {!usuario ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        ) : (
          <>
            <span className="text-sm">👤 {usuario.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-sm"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
