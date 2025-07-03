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
    <nav className="bg-blue-600 text-white px-6 py-4 shadow">
      <div className="flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          📚 BibliotecaApp
        </Link>

        <div className="space-x-4">
          <Link to="/">Inicio</Link>

          {!usuario ? (
            <>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/libros">Libros</Link>
              <Link to="/mis-prestamos">Mis Préstamos</Link>
              <Link to="/logout">Cerrar sesión</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
