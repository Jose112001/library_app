import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const Navbar = () => {
  const { usuario, handleLogout } = useContext(UserContext);


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
              <Link to="/prestamos">Mis Préstamos</Link>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
