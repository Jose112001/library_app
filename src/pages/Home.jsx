import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { supabase } from "../services/supabase";

const Home = () => {
  const [user, setUser] = useState(null);
  const [dataUsr, setDataUsr] = useState(null);
  const [stats, setStats] = useState(null);
  const { handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user) {
        navigate("/login");
        return;
      }

      console.log(userData);

      const { data: dataUsu, error: errorUsu } = await supabase
        .from("usuarios")
        .select("id_usuario, nombre")
        .eq("id_auth", user.id)
        .single();

      setDataUsr(dataUsu);
      setUser(userData.user);
      console.log("userData.user");
      console.log(dataUsu);
      const [librosTotal, prestamosActivos, misPrestamos] =
        await Promise.all([
          supabase.from("libros").select("*", { count: "exact", head: true }),
          supabase
            .from("prestamos")
            .select("*", { count: "exact", head: true })
            .eq("estado", "1"),
          supabase
            .from("prestamos")
            .select("*", { count: "exact", head: true })
            .eq("estado", "1")
            .eq("id_usuario",dataUsr.id_usuario),
        ]);

      setStats({
        totalLibros: librosTotal.count ?? 0,
        prestamosActivos: prestamosActivos.count ?? 0,
        misPrestamos: misPrestamos.count ?? 0,
      });
    };

    fetchUserAndStats();
  }, [navigate]);

  return (
    <div
      className="contenedor" /*style={{backgroundImage: `url(${bgImage})`,backgroundSize: "cover",backgroundPosition: "center",minHeight: "100vh",padding: "2rem",}}*/
    >
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">Bienvenido a la Biblioteca 📚</h1>

        {user && (
          <div className="text-gray-700">
            <p>
              <strong>Correo:</strong> {user.email}
            </p>
            {user.user_metadata?.full_name && (
              <p>
                <strong>Nombre:</strong> {user.user_metadata.full_name}
              </p>
            )}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-blue-100 rounded">
              <h2 className="text-lg font-bold">{stats.totalLibros}</h2>
              <p>Total de libros</p>
            </div>
            <div className="p-4 bg-yellow-100 rounded">
              <h2 className="text-lg font-bold">{stats.prestamosActivos}</h2>
              <p>Préstamos activos</p>
            </div>
            <div className="p-4 bg-purple-100 rounded">
              <h2 className="text-lg font-bold">{stats.misPrestamos}</h2>
              <p>Mis préstamos activos</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
