import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const a = (p) => location.pathname === p ? 'nav-link active' : 'nav-link';

  const token = localStorage.getItem('token');
  const korisnickoIme = localStorage.getItem('korisnickoIme');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('korisnickoIme');
    localStorage.removeItem('uloga');
    setMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">B</span>
        <span>Bella Sposa</span>
      </Link>
      <button className="menu-toggle" onClick={() => setMenu(!menu)}>☰</button>
      <div className={`navbar-links ${menu ? 'open' : ''}`}>
        <Link to="/"        className={a('/')}        onClick={() => setMenu(false)}>Početna</Link>
        <Link to="/katalog" className={a('/katalog')} onClick={() => setMenu(false)}>Katalog</Link>
        <Link to="/search"  className={a('/search')}  onClick={() => setMenu(false)}>Pretraga</Link>
        <Link to="/o-nama"  className={a('/o-nama')}  onClick={() => setMenu(false)}>O Nama</Link>

        {token ? (
          <>
            <Link to="/admin" className="btn-nav" onClick={() => setMenu(false)}>Admin</Link>
            <button className="btn-nav" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Odjavi se ({korisnickoIme})
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-nav" onClick={() => setMenu(false)}>Prijava</Link>
        )}
      </div>
    </nav>
  );
}