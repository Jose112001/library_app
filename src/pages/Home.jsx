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

  // 1. Obtener el usuario autenticado
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        navigate("/login");
        return;
      }
      setUser(data.user);
    };
    fetchUser();
  }, [navigate]);

  // 2. Obtener información del usuario desde la tabla "usuarios"
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("usuarios")
        .select("id_usuario, nombre, id_rol")
        .eq("id_auth", user.id)
        .single();

      if (error) {
        console.error("Error al obtener datos del usuario:", error);
        return;
      }

      setDataUsr(data);
    };
    fetchUserData();
  }, [user]);

  // 3. Obtener estadísticas si ya está disponible dataUsr
  useEffect(() => {
    if (!dataUsr) return;

    const fetchStats = async () => {
      const [librosTotal, prestamosActivos, misPrestamos] = await Promise.all([
        supabase.from("libros").select("*", { count: "exact", head: true }),
        supabase
          .from("prestamos")
          .select("*", { count: "exact", head: true })
          .eq("estado", "1"),
        supabase
          .from("prestamos")
          .select("*", { count: "exact", head: true })
          .eq("estado", "1")
          .eq("id_usuario", dataUsr.id_usuario),
      ]);

      setStats({
        totalLibros: librosTotal.count ?? 0,
        prestamosActivos: prestamosActivos.count ?? 0,
        misPrestamos: misPrestamos.count ?? 0,
      });
    };
    fetchStats();
  }, [dataUsr]);

  return (
    <div className="contenedor">
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">Bienvenido a la Biblioteca 📚</h1>

        {user && (
          <div className="text-gray-700">
            <p>
              <strong>Correo:</strong> {user.email}
            </p>
            <p>
              <strong>Nombre:</strong>{" "}
              {user.user_metadata.full_name
                ? user.user_metadata.full_name
                : "Administrador"}
            </p>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-blue-100 rounded">
              <h2 className="text-lg font-bold">{stats.totalLibros}</h2>
              <p>Total de libros</p>
            </div>

            {dataUsr?.id_rol == 1 && (
              <div className="p-4 bg-purple-100 rounded">
                <h2 className="text-lg font-bold">{stats.misPrestamos}</h2>
                <p>Mis préstamos activos</p>
              </div>
            )}
            {dataUsr?.id_rol == 2 && (
              <div className="p-4 bg-purple-100 rounded">
                <h2 className="text-lg font-bold">{stats.prestamosActivos}</h2>
                <p>Préstamos activos</p>
              </div>
            )}
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
