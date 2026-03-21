import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import Search from './pages/Search';
import ONama from './pages/ONama';
import Admin from './pages/Admin';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/"         element={<Home />}    />
            <Route path="/katalog"  element={<Katalog />} />
            <Route path="/search"   element={<Search />}  />
            <Route path="/o-nama"   element={<ONama />}   />
            <Route path="/admin"    element={<Admin />}   />
            {/* Preusmeravanje nepostojećih ruta na početnu */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}