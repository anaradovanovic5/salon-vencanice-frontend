import { useState } from 'react';
import { getSlobodneVencanice, getVencaniceByVelicina } from '../services/api';
import VencanicaCard from '../components/VencanicaCard';

const VELICINE = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Search() {
  const [rezultati, setRezultati] = useState([]);
  const [velicina, setVelicina]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [trazeno, setTrazeno]     = useState(false);
  const [opis, setOpis]           = useState('');

  const trazi = async (fn, opisPretr) => {
    setLoading(true); setTrazeno(true);
    try {
      const res = await fn();
      setRezultati(res.data.data);
      setOpis(`${res.data.data.length} rezultata — ${opisPretr}`);
    } catch { setOpis('Greška pri pretrazi.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-inner">
      <div className="katalog-header">
        <h1>Pretraga venčanica</h1>
        <p>Pronađite venčanicu koja savršeno pristaje</p>
      </div>

      <div className="search-cards-row">
        <div className="search-card">
          <div className="search-card-icon">✓</div>
          <h3>Slobodne venčanice</h3>
          <p>Prikaži sve venčanice koje su trenutno dostupne za iznajmljivanje</p>
          <button className="btn-primary" onClick={() => trazi(getSlobodneVencanice, 'slobodne')}>
            Prikaži slobodne
          </button>
        </div>

        <div className="search-card">
          <div className="search-card-icon">📏</div>
          <h3>Pretraga po veličini</h3>
          <p>Pronađite venčanicu u vašoj veličini</p>
          <div className="velicina-grid">
            {VELICINE.map(v => (
              <button key={v}
                className={`btn-vel ${velicina === v ? 'selected' : ''}`}
                onClick={() => setVelicina(v)}>{v}</button>
            ))}
          </div>
          <button className="btn-primary" style={{marginTop: '14px'}}
            onClick={() => {
              if (!velicina) return;
              trazi(() => getVencaniceByVelicina(velicina), `veličina ${velicina}`);
            }}>
            Pretraži
          </button>
        </div>
      </div>

      {opis && <p className="search-opis">{opis}</p>}
      {loading && <div className="loading">Pretraga u toku...</div>}

      {trazeno && !loading && (
        rezultati.length === 0
          ? <div className="empty-state"><p>Nema rezultata za izabrani filter.</p></div>
          : <div className="card-grid-4">
              {rezultati.map((v, i) => (
                <VencanicaCard key={v.idVencanica} vencanica={v} model={null} index={i} />
              ))}
            </div>
      )}
    </div>
  );
}