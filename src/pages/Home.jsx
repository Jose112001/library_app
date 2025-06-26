import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        navigate("/login");
        return;
      }

      setUser(userData.user);

      // Consultar estadísticas
      const [librosTotal, librosDisponibles, prestamosActivos, misPrestamos] = await Promise.all([
        supabase.from("libros").select("*", { count: "exact", head: true }),
        supabase.from("libros").select("*", { count: "exact", head: true }).eq("disponible", true),
        supabase.from("prestamos").select("*", { count: "exact", head: true }).eq("devuelto", false),
        supabase
          .from("prestamos")
          .select("*", { count: "exact", head: true })
          .eq("devuelto", false)
          .eq("id_usuario", userData.user.id),
      ]);

      setStats({
        totalLibros: librosTotal.count ?? 0,
        librosDisponibles: librosDisponibles.count ?? 0,
        prestamosActivos: prestamosActivos.count ?? 0,
        misPrestamos: misPrestamos.count ?? 0,
      });
    };

    fetchUserAndStats();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">Bienvenido a la Biblioteca 📚</h1>

      {user && (
        <div className="text-gray-700">
          <p><strong>Correo:</strong> {user.email}</p>
          {user.user_metadata?.nombres && (
            <p><strong>Nombre:</strong> {user.user_metadata.nombres}</p>
          )}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-blue-100 rounded">
            <h2 className="text-lg font-bold">{stats.totalLibros}</h2>
            <p>Total de libros</p>
          </div>
          <div className="p-4 bg-green-100 rounded">
            <h2 className="text-lg font-bold">{stats.librosDisponibles}</h2>
            <p>Libros disponibles</p>
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
  );
};

export default Home;
