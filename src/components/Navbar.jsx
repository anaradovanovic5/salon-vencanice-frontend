import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const a = (p) => location.pathname === p ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🌸</span>
        <span>Bella Sposa</span>
      </Link>
      <button className="menu-toggle" onClick={() => setMenu(!menu)}>☰</button>
      <div className={`navbar-links ${menu ? 'open' : ''}`}>
        <Link to="/"        className={a('/')}        onClick={() => setMenu(false)}>Početna</Link>
        <Link to="/katalog" className={a('/katalog')} onClick={() => setMenu(false)}>Katalog</Link>
        <Link to="/search"  className={a('/search')}  onClick={() => setMenu(false)}>Pretraga</Link>
        <Link to="/o-nama"  className={a('/o-nama')}  onClick={() => setMenu(false)}>O Nama</Link>
        <Link to="/admin"   className="btn-nav"        onClick={() => setMenu(false)}>Admin</Link>
      </div>
    </nav>
  );
}