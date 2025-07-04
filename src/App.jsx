import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AgregarLibro from "./components/AgregarLibro";
import Navbar from "./components/Navbar";
import AdminPanel from "./pages/AdminPanel";
import Callback from "./pages/Callback";
import Home from "./pages/Home";
import Libros from "./pages/Libros";
import Login from "./pages/Login";
import Prestamos from "./pages/Prestamos";
import Register from "./pages/Register";
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
          <Route path="/callback" element={<Callback />} />
          {/* <Route path="/admin/libros/agregar" element={<RutaPrivadaAdmin><AgregarLibro /></RutaPrivadaAdmin>} /> */}
          <Route path="/libros/agregar" element={<AgregarLibro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
