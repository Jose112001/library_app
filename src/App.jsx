import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Libros from "./pages/Libros";
import Prestamos from "./pages/Prestamos";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Register from "./pages/Register";
import AgregarLibro from "./components/AgregarLibro";
// import RutaPrivadaAdmin from  "./components/AgregarLibro";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/admin/libros/agregar" element={<RutaPrivadaAdmin><AgregarLibro /></RutaPrivadaAdmin>} /> */}
          <Route path="/libros/agregar" element={<AgregarLibro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
