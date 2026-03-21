import { useEffect, useState } from 'react';
import {
  getAllVencanice, addVencanica, deleteVencanica,
  getAllIznajmljivanja, addIznajmljivanje, deleteIznajmljivanje,
  getAllModeli, getAllKlijenti, getAllZaposleni, getAktivnaIznajmljivanja
} from '../services/api';

const PRAZNA_VENCANICA = {
  serijskiBroj: '', status: 0, godinaProizvodnje: new Date().getFullYear(),
  velicina: 'M', napomene: '', modelId: ''
};

const PRAZNO_IZNAJMLJIVANJE = {
  datumUzimanja: '', datumVracanja: '',
  vencanicaId: '', klijentId: '', zaposleniId: ''
};

export default function Admin() {
  const [tab, setTab] = useState('vencanice');

  // podaci
  const [vencanice, setVencanice] = useState([]);
  const [iznajmljivanja, setIznajmljivanja] = useState([]);
  const [modeli, setModeli] = useState([]);
  const [klijenti, setKlijenti] = useState([]);
  const [zaposleni, setZaposleni] = useState([]);
  const [vencanicaMap, setVencanicaMap] = useState({});
  const [klijentMap, setKlijentMap] = useState({});

  // forme
  const [formV, setFormV] = useState(PRAZNA_VENCANICA);
  const [formI, setFormI] = useState(PRAZNO_IZNAJMLJIVANJE);

  const [poruka, setPoruka] = useState({ text: '', tip: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { ucitajSve(); }, []);

  const ucitajSve = async () => {
    setLoading(true);
    try {
      const [vRes, iRes, mRes, kRes, zRes] = await Promise.all([
        getAllVencanice(), getAktivnaIznajmljivanja(),
        getAllModeli(), getAllKlijenti(), getAllZaposleni()
      ]);
      setVencanice(vRes.data.data);
      setIznajmljivanja(iRes.data.data);
      setModeli(mRes.data.data);
      setKlijenti(kRes.data.data);
      setZaposleni(zRes.data.data);
      const vMapa = {};
      vRes.data.data.forEach(v => { vMapa[v.idVencanica] = v; });
      setVencanicaMap(vMapa);

      const kMapa = {};
      kRes.data.data.forEach(k => { kMapa[k.idKlijent] = k; });
      setKlijentMap(kMapa);
    } catch (e) {
      showPoruka('Greška pri učitavanju.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showPoruka = (text, tip = 'success') => {
    setPoruka({ text, tip });
    setTimeout(() => setPoruka({ text: '', tip: '' }), 4000);
  };

  // ── Vencanica handlers ───────────────────────────────────────
  const handleAddVencanica = async () => {
    if (!formV.serijskiBroj || !formV.modelId) {
      showPoruka('Serijski broj i model su obavezni!', 'error');
      return;
    }
    try {
      await addVencanica({
        ...formV,
        modelId: parseInt(formV.modelId),
        status: parseInt(formV.status),
        godinaProizvodnje: parseInt(formV.godinaProizvodnje)
      });
      showPoruka('✓ Venčanica uspešno dodata!');
      setFormV(PRAZNA_VENCANICA);
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri dodavanju.', 'error');
    }
  };

  const handleDeleteVencanica = async (id, serBr) => {
    if (!window.confirm(`Obrisati venčanicu ${serBr}?`)) return;
    try {
      await deleteVencanica(id);
      showPoruka('✓ Venčanica obrisana.');
      ucitajSve();
    } catch (e) {
      showPoruka('Greška pri brisanju.', 'error');
    }
  };

  // ── Iznajmljivanje handlers ──────────────────────────────────
  const handleAddIznajmljivanje = async () => {
    const { datumUzimanja, datumVracanja, vencanicaId, klijentId, zaposleniId } = formI;
    if (!datumUzimanja || !datumVracanja || !vencanicaId || !klijentId || !zaposleniId) {
      showPoruka('Sva polja su obavezna!', 'error');
      return;
    }
    try {
      await addIznajmljivanje({
        datumUzimanja, datumVracanja,
        vencanicaId: parseInt(vencanicaId),
        klijentId: parseInt(klijentId),
        zaposleniId: parseInt(zaposleniId)
      });
      showPoruka('✓ Iznajmljivanje uspešno kreirano!');
      setFormI(PRAZNO_IZNAJMLJIVANJE);
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška.', 'error');
    }
  };

  const handleDeleteIznajmljivanje = async (id) => {
    if (!window.confirm('Obrisati iznajmljivanje i osloboditi venčanicu?')) return;
    try {
      await deleteIznajmljivanje(id);
      showPoruka('✓ Iznajmljivanje obrisano, venčanica slobodna.');
      ucitajSve();
    } catch (e) {
      showPoruka('Greška pri brisanju.', 'error');
    }
  };

  const slobodneVencanice = vencanice.filter(v => v.status === 0);

  return (
    <div className="page">
      <h1>Admin Panel</h1>

      {poruka.text && (
        <div className={`poruka ${poruka.tip}`}>{poruka.text}</div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${tab === 'vencanice' ? 'active' : ''}`}
          onClick={() => setTab('vencanice')}
        >
          Venčanice ({vencanice.length})
        </button>
        <button
          className={`tab ${tab === 'iznajmljivanje' ? 'active' : ''}`}
          onClick={() => setTab('iznajmljivanje')}
        >
          Iznajmljivanja ({iznajmljivanja.length})
        </button>
      </div>

      {loading && <div className="loading">Učitavanje...</div>}

      {/* ── TAB: Vencanice ─────────────────────────────────── */}
      {tab === 'vencanice' && (
        <>
          <div className="admin-form">
            <h3>Dodaj novu venčanicu</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Serijski broj *</label>
                <input value={formV.serijskiBroj}
                  onChange={e => setFormV({ ...formV, serijskiBroj: e.target.value })}
                  placeholder="VEN-005" />
              </div>
              <div className="form-group">
                <label>Model *</label>
                <select value={formV.modelId}
                  onChange={e => setFormV({ ...formV, modelId: e.target.value })}>
                  <option value="">Izaberi model</option>
                  {modeli.map(m => (
                    <option key={m.idModel} value={m.idModel}>
                      {m.naziv} — {m.boja}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Veličina</label>
                <select value={formV.velicina}
                  onChange={e => setFormV({ ...formV, velicina: e.target.value })}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(v =>
                    <option key={v} value={v}>{v}</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Godina proizvodnje</label>
                <input type="number" value={formV.godinaProizvodnje}
                  onChange={e => setFormV({ ...formV, godinaProizvodnje: e.target.value })} />
              </div>
              <div className="form-group full">
                <label>Napomene</label>
                <input value={formV.napomene}
                  onChange={e => setFormV({ ...formV, napomene: e.target.value })}
                  placeholder="Opcione napomene..." />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAddVencanica}>
              + Dodaj venčanicu
            </button>
          </div>

          <h3>Sve venčanice ({vencanice.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Serijski br.</th><th>Veličina</th>
                <th>Godina</th><th>Status</th><th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {vencanice.map(v => (
                <tr key={v.idVencanica}>
                  <td>{v.idVencanica}</td>
                  <td>{v.serijskiBroj}</td>
                  <td>{v.velicina}</td>
                  <td>{v.godinaProizvodnje}</td>
                  <td>
                    <span className={`badge ${v.status === 0 ? 'slobodna' : 'iznajmljena'}`}>
                      {v.status === 0 ? 'Slobodna' : 'Iznajmljena'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteVencanica(v.idVencanica, v.serijskiBroj)}
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ── TAB: Iznajmljivanje ─────────────────────────────── */}
      {tab === 'iznajmljivanje' && (
        <>
          <div className="admin-form">
            <h3>Novo iznajmljivanje</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Venčanica (slobodne) *</label>
                <select value={formI.vencanicaId}
                  onChange={e => setFormI({ ...formI, vencanicaId: e.target.value })}>
                  <option value="">Izaberi venčanicu</option>
                  {slobodneVencanice.map(v => (
                    <option key={v.idVencanica} value={v.idVencanica}>
                      {v.serijskiBroj} — vel. {v.velicina}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Klijent *</label>
                <select value={formI.klijentId}
                  onChange={e => setFormI({ ...formI, klijentId: e.target.value })}>
                  <option value="">Izaberi klijenta</option>
                  {klijenti.map(k => (
                    <option key={k.idKlijent} value={k.idKlijent}>
                      {k.ime} {k.prezime}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Zaposleni *</label>
                <select value={formI.zaposleniId}
                  onChange={e => setFormI({ ...formI, zaposleniId: e.target.value })}>
                  <option value="">Izaberi zaposlenog</option>
                  {zaposleni.map(z => (
                    <option key={z.idZaposleni} value={z.idZaposleni}>
                      {z.ime} {z.prezime}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Datum uzimanja *</label>
                <input type="date" value={formI.datumUzimanja}
                  onChange={e => setFormI({ ...formI, datumUzimanja: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Datum vraćanja *</label>
                <input type="date" value={formI.datumVracanja}
                  onChange={e => setFormI({ ...formI, datumVracanja: e.target.value })} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAddIznajmljivanje}>
              + Kreiraj iznajmljivanje
            </button>
          </div>

          <h3>Aktivna iznajmljivanja ({iznajmljivanja.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Venčanica</th>
                <th>Klijent</th>
                <th>Datum uzimanja</th>
                <th>Datum vraćanja</th>
                <th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {iznajmljivanja.length === 0
                ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                  Nema aktivnih iznajmljivanja.
                </td></tr>
                : iznajmljivanja.map(i => {
                  const v = vencanicaMap[i.vencanicaId];
                  const k = klijentMap[i.klijentId];
                  return (
                    <tr key={i.idIznajmljivanje}>
                      <td>{i.idIznajmljivanje}</td>
                      <td>
                        <strong>{v ? v.serijskiBroj : `ID: ${i.vencanicaId}`}</strong>
                        {v && <span style={{ color: '#888', fontSize: '0.8rem', display: 'block' }}>
                          vel. {v.velicina}
                        </span>}
                      </td>
                      <td>
                        <strong>{k ? `${k.ime} ${k.prezime}` : `ID: ${i.klijentId}`}</strong>
                        {k && <span style={{ color: '#888', fontSize: '0.8rem', display: 'block' }}>
                          {k.telefon}
                        </span>}
                      </td>
                      <td>{i.datumUzimanja}</td>
                      <td>{i.datumVracanja}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteIznajmljivanje(i.idIznajmljivanje)}
                        >
                          Vrati
                        </button>
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}