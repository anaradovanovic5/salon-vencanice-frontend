import { useEffect, useState } from 'react';
import { getAllVencanice, getAllModeli } from '../services/api';
import VencanicaCard from '../components/VencanicaCard';

const VELICINE = ['Sve', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Katalog() {
  const [vencanice, setVencanice] = useState([]);
  const [modeli, setModeli]       = useState({});
  const [filter, setFilter]       = useState('Sve');
  const [statusFilter, setStatus] = useState('sve');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [vRes, mRes] = await Promise.all([getAllVencanice(), getAllModeli()]);
        const mapa = {};
        mRes.data.data.forEach(m => { mapa[m.idModel] = m; });
        setModeli(mapa);
        setVencanice(vRes.data.data);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const filtrirane = vencanice.filter(v => {
    const velOk = filter === 'Sve' || v.velicina === filter;
    const statOk = statusFilter === 'sve' ||
      (statusFilter === 'slobodne' && v.status === 0) ||
      (statusFilter === 'iznajmljene' && v.status === 1);
    return velOk && statOk;
  });

  return (
    <div className="page-inner">
      <div className="katalog-header">
        <h1>Katalog venčanica</h1>
        <p>Pronađena <strong>{filtrirane.length}</strong> venčanica</p>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Veličina:</span>
          {VELICINE.map(v => (
            <button key={v}
              className={`filter-btn ${filter === v ? 'active' : ''}`}
              onClick={() => setFilter(v)}>{v}</button>
          ))}
        </div>
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          {[['sve','Sve'],['slobodne','Slobodne'],['iznajmljene','Iznajmljene']].map(([val, label]) => (
            <button key={val}
              className={`filter-btn ${statusFilter === val ? 'active' : ''}`}
              onClick={() => setStatus(val)}>{label}</button>
          ))}
        </div>
      </div>

      {loading
        ? <div className="loading">Učitavanje kolekcije...</div>
        : filtrirane.length === 0
          ? <div className="empty-state">
              <p>🔍 Nema venčanica za izabrane filtere.</p>
              <button className="btn-outline" onClick={() => { setFilter('Sve'); setStatus('sve'); }}>
                Resetuj filtere
              </button>
            </div>
          : <div className="card-grid-4">
              {filtrirane.map((v, i) => (
                <VencanicaCard key={v.idVencanica} vencanica={v} model={modeli[v.modelId]} index={i} />
              ))}
            </div>
      }
    </div>
  );
}