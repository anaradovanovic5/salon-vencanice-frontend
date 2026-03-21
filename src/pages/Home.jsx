import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVencanice, getAllModeli, getSlobodneVencanice } from '../services/api';
import VencanicaCard from '../components/VencanicaCard';

export default function Home() {
  const [vencanice, setVencanice] = useState([]);
  const [modeli, setModeli]       = useState({});
  const [slobodnih, setSlobodnih] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, mRes, sRes] = await Promise.all([
          getAllVencanice(), getAllModeli(), getSlobodneVencanice()
        ]);
        const mapa = {};
        mRes.data.data.forEach(m => { mapa[m.idModel] = m; });
        setModeli(mapa);
        setVencanice(vRes.data.data.slice(0, 3)); // samo 3 za homepage
        setSlobodnih(sRes.data.data.length);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-sub">Dobrodošli u</p>
          <h1 className="hero-title">Bella Sposa Salon</h1>
          <p className="hero-desc">
            Pronađite savršenu venčanicu za vaš poseban dan.<br />
            Ekskluzivni dizajni, premium materijali, nezaboravni trenuci.
          </p>
          <div className="hero-btns">
            <Link to="/katalog" className="btn-hero-primary">Pogledaj katalog</Link>
            <Link to="/search"  className="btn-hero-secondary">Pretraži po veličini</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-bar">
        <div className="stat"><span className="stat-num">{vencanice.length}+</span><span>Venčanica</span></div>
        <div className="stat"><span className="stat-num">{slobodnih}</span><span>Slobodnih</span></div>
        <div className="stat"><span className="stat-num">6+</span><span>Dizajnera</span></div>
        <div className="stat"><span className="stat-num">500+</span><span>Srećnih klijentica</span></div>
      </section>

      {/* FEATURED */}
      <section className="section">
        <div className="section-header">
          <h2>Istaknute venčanice</h2>
          <p>Ručno odabrani modeli za vaš savršeni dan</p>
        </div>
        {loading
          ? <div className="loading">Učitavanje...</div>
          : <div className="card-grid">
              {vencanice.map((v, i) => (
                <VencanicaCard key={v.idVencanica} vencanica={v} model={modeli[v.modelId]} index={i} />
              ))}
            </div>
        }
        <div className="center-btn">
          <Link to="/katalog" className="btn-outline">Vidi sve venčanice →</Link>
        </div>
      </section>

      {/* ZASTO MI */}
      <section className="section bg-light">
        <div className="section-header">
          <h2>Zašto izabrati nas?</h2>
        </div>
        <div className="features-grid">
          {[
            ['💎', 'Premium kolekcija', 'Ekskluzivni dizajni od vodećih svetskih dizajnera'],
            ['👗', 'Sve veličine', 'Venčanice u veličinama XS do XXL, prilagođene svakom telu'],
            ['✨', 'Vrhunski materijali', 'Svila, čipka, taft i saten najvišeg kvaliteta'],
            ['💝', 'Personalizovana usluga', 'Naš tim je tu za vas od prvog sastanka do vašeg dana'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Pronađite savršenu venčanicu</h2>
        <p>Pregledajte našu kolekciju ili nas kontaktirajte za zakazivanje</p>
        <div className="hero-btns">
          <Link to="/katalog" className="btn-hero-primary">Katalog venčanica</Link>
          <Link to="/o-nama"  className="btn-hero-secondary">Saznajte više</Link>
        </div>
      </section>
    </>
  );
}