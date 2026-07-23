import { useEffect, useState } from 'react';
import {
  getAllVencanice, addVencanica, updateVencanica, deleteVencanica,
  getAllIznajmljivanja, addIznajmljivanje, updateIznajmljivanje, deleteIznajmljivanje, getAktivnaIznajmljivanja,
  getAllModeli, addModel, updateModel, deleteModel,
  getAllKlijenti, addKlijent, updateKlijent, deleteKlijent,
  getAllZaposleni, addZaposleni, updateZaposleni, deleteZaposleni,
  getAllGradovi, addGrad, updateGrad, deleteGrad
} from '../services/api';

const PRAZNA_VENCANICA = {
  serijskiBroj: '', status: 0, godinaProizvodnje: new Date().getFullYear(),
  velicina: 'M', napomene: '', modelId: ''
};
const PRAZNO_IZNAJMLJIVANJE = {
  datumUzimanja: '', datumVracanja: '',
  vencanicaId: '', klijentId: '', zaposleniId: ''
};
const PRAZAN_GRAD = { naziv: '' };
const PRAZAN_MODEL = { naziv: '', dizajner: '', boja: '', materijal: '' };
const PRAZAN_KLIJENT = { ime: '', prezime: '', godine: '', telefon: '', email: '', adresa: '', gradId: '' };
const PRAZAN_ZAPOSLENI = { ime: '', prezime: '', korisnickoIme: '', lozinka: '', uloga: 'ZAPOSLENI' };

export default function Admin() {
  const [tab, setTab] = useState('vencanice');

  // podaci
  const [vencanice, setVencanice] = useState([]);
  const [iznajmljivanja, setIznajmljivanja] = useState([]);
  const [modeli, setModeli] = useState([]);
  const [klijenti, setKlijenti] = useState([]);
  const [zaposleni, setZaposleni] = useState([]);
  const [gradovi, setGradovi] = useState([]);
  const [vencanicaMap, setVencanicaMap] = useState({});
  const [klijentMap, setKlijentMap] = useState({});
  const [gradMap, setGradMap] = useState({});

  // forme (add)
  const [formV, setFormV] = useState(PRAZNA_VENCANICA);
  const [formI, setFormI] = useState(PRAZNO_IZNAJMLJIVANJE);
  const [formG, setFormG] = useState(PRAZAN_GRAD);
  const [formM, setFormM] = useState(PRAZAN_MODEL);
  const [formK, setFormK] = useState(PRAZAN_KLIJENT);
  const [formZ, setFormZ] = useState(PRAZAN_ZAPOSLENI);

  // edit mode: null = dodavanje, broj = id koji se menja
  const [editVId, setEditVId] = useState(null);
  const [editGId, setEditGId] = useState(null);
  const [editMId, setEditMId] = useState(null);
  const [editKId, setEditKId] = useState(null);
  const [editZId, setEditZId] = useState(null);
  const [editIId, setEditIId] = useState(null);

  const [poruka, setPoruka] = useState({ text: '', tip: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { ucitajSve(); }, []);

  const ucitajSve = async () => {
    setLoading(true);
    try {
      const [vRes, iRes, mRes, kRes, zRes, gRes] = await Promise.all([
        getAllVencanice(), getAktivnaIznajmljivanja(),
        getAllModeli(), getAllKlijenti(), getAllZaposleni(), getAllGradovi()
      ]);
      setVencanice(vRes.data.data);
      setIznajmljivanja(iRes.data.data);
      setModeli(mRes.data.data);
      setKlijenti(kRes.data.data);
      setZaposleni(zRes.data.data);
      setGradovi(gRes.data.data);

      const vMapa = {};
      vRes.data.data.forEach(v => { vMapa[v.idVencanica] = v; });
      setVencanicaMap(vMapa);

      const kMapa = {};
      kRes.data.data.forEach(k => { kMapa[k.idKlijent] = k; });
      setKlijentMap(kMapa);

      const gMapa = {};
      gRes.data.data.forEach(g => { gMapa[g.idGrad] = g; });
      setGradMap(gMapa);
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

  // ── Vencanica ──────────────────────────────────────────────
  const handleSubmitVencanica = async () => {
    if (!formV.serijskiBroj || !formV.modelId) {
      showPoruka('Serijski broj i model su obavezni!', 'error');
      return;
    }
    const payload = {
      ...formV,
      modelId: parseInt(formV.modelId),
      status: parseInt(formV.status),
      godinaProizvodnje: parseInt(formV.godinaProizvodnje)
    };
    try {
      if (editVId) {
        await updateVencanica(editVId, payload);
        showPoruka('✓ Venčanica izmenjena!');
      } else {
        await addVencanica(payload);
        showPoruka('✓ Venčanica uspešno dodata!');
      }
      setFormV(PRAZNA_VENCANICA);
      setEditVId(null);
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri čuvanju.', 'error');
    }
  };

  const handleEditVencanica = (v) => {
    setFormV({
      serijskiBroj: v.serijskiBroj, status: v.status,
      godinaProizvodnje: v.godinaProizvodnje, velicina: v.velicina,
      napomene: v.napomene || '', modelId: v.modelId
    });
    setEditVId(v.idVencanica);
    setTab('vencanice');
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

  // ── Iznajmljivanje ──────────────────────────────────────────────
const handleSubmitIznajmljivanje = async () => {
  const { datumUzimanja, datumVracanja, vencanicaId, klijentId, zaposleniId } = formI;
  if (!datumUzimanja || !datumVracanja) {
    showPoruka('Datumi su obavezni!', 'error');
    return;
  }
  try {
    if (editIId) {
      await updateIznajmljivanje(editIId, { datumUzimanja, datumVracanja });
      showPoruka('✓ Iznajmljivanje izmenjeno!');
    } else {
      if (!vencanicaId || !klijentId || !zaposleniId) {
        showPoruka('Sva polja su obavezna!', 'error');
        return;
      }
      await addIznajmljivanje({
        datumUzimanja, datumVracanja,
        vencanicaId: parseInt(vencanicaId),
        klijentId: parseInt(klijentId),
        zaposleniId: parseInt(zaposleniId)
      });
      showPoruka('✓ Iznajmljivanje uspešno kreirano!');
    }
    setFormI(PRAZNO_IZNAJMLJIVANJE);
    setEditIId(null);
    ucitajSve();
  } catch (e) {
    showPoruka(e.response?.data?.message || 'Greška.', 'error');
  }
};

const handleEditIznajmljivanje = (i) => {
  setFormI({
    datumUzimanja: i.datumUzimanja, datumVracanja: i.datumVracanja,
    vencanicaId: i.vencanicaId, klijentId: i.klijentId, zaposleniId: i.zaposleniId
  });
  setEditIId(i.idIznajmljivanje);
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

  // ── Grad ─────────────────────────────────────────────────────
  const handleSubmitGrad = async () => {
    if (!formG.naziv) { showPoruka('Naziv grada je obavezan!', 'error'); return; }
    try {
      if (editGId) {
        await updateGrad(editGId, formG);
        showPoruka('✓ Grad izmenjen!');
      } else {
        await addGrad(formG);
        showPoruka('✓ Grad dodat!');
      }
      setFormG(PRAZAN_GRAD);
      setEditGId(null);
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri čuvanju.', 'error');
    }
  };

  const handleEditGrad = (g) => {
    setFormG({ naziv: g.naziv });
    setEditGId(g.idGrad);
    setTab('gradovi');
  };

  const handleDeleteGrad = async (id, naziv) => {
    if (!window.confirm(`Obrisati grad ${naziv}?`)) return;
    try {
      await deleteGrad(id);
      showPoruka('✓ Grad obrisan.');
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri brisanju (možda je u upotrebi).', 'error');
    }
  };

  // ── ModelVencanice ─────────────────────────────────────────
  const handleSubmitModel = async () => {
    if (!formM.naziv) { showPoruka('Naziv modela je obavezan!', 'error'); return; }
    try {
      if (editMId) {
        await updateModel(editMId, formM);
        showPoruka('✓ Model izmenjen!');
      } else {
        await addModel(formM);
        showPoruka('✓ Model dodat!');
      }
      setFormM(PRAZAN_MODEL);
      setEditMId(null);
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri čuvanju.', 'error');
    }
  };

  const handleEditModel = (m) => {
    setFormM({ naziv: m.naziv, dizajner: m.dizajner || '', boja: m.boja || '', materijal: m.materijal || '' });
    setEditMId(m.idModel);
    setTab('modeli');
  };

  const handleDeleteModel = async (id, naziv) => {
    if (!window.confirm(`Obrisati model ${naziv}?`)) return;
    try {
      await deleteModel(id);
      showPoruka('✓ Model obrisan.');
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri brisanju (možda je u upotrebi).', 'error');
    }
  };

  // ── Klijent ──────────────────────────────────────────────────
  const handleSubmitKlijent = async () => {
    if (!formK.ime || !formK.prezime || !formK.telefon) {
      showPoruka('Ime, prezime i telefon su obavezni!', 'error');
      return;
    }
    const payload = {
      ...formK,
      godine: formK.godine ? parseInt(formK.godine) : null,
      gradId: formK.gradId ? parseInt(formK.gradId) : null
    };
    try {
      if (editKId) {
        await updateKlijent(editKId, payload);
        showPoruka('✓ Klijent izmenjen!');
      } else {
        await addKlijent(payload);
        showPoruka('✓ Klijent dodat!');
      }
      setFormK(PRAZAN_KLIJENT);
      setEditKId(null);
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri čuvanju.', 'error');
    }
  };

  const handleEditKlijent = (k) => {
    setFormK({
      ime: k.ime, prezime: k.prezime, godine: k.godine || '',
      telefon: k.telefon, email: k.email || '', adresa: k.adresa || '',
      gradId: k.gradId || ''
    });
    setEditKId(k.idKlijent);
    setTab('klijenti');
  };

  const handleDeleteKlijent = async (id, ime) => {
    if (!window.confirm(`Obrisati klijenta ${ime}?`)) return;
    try {
      await deleteKlijent(id);
      showPoruka('✓ Klijent obrisan.');
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri brisanju (možda ima iznajmljivanja).', 'error');
    }
  };

  // ── Zaposleni ──────────────────────────────────────────────
  const handleSubmitZaposleni = async () => {
    if (!formZ.ime || !formZ.prezime || !formZ.korisnickoIme) {
      showPoruka('Ime, prezime i korisničko ime su obavezni!', 'error');
      return;
    }
    if (!editZId && !formZ.lozinka) {
      showPoruka('Lozinka je obavezna za novog zaposlenog!', 'error');
      return;
    }
    try {
      if (editZId) {
        // ako je lozinka prazna pri izmeni, ne menjamo je
        const payload = { ...formZ };
        if (!payload.lozinka) delete payload.lozinka;
        await updateZaposleni(editZId, payload);
        showPoruka('✓ Zaposleni izmenjen!');
      } else {
        await addZaposleni(formZ);
        showPoruka('✓ Zaposleni dodat!');
      }
      setFormZ(PRAZAN_ZAPOSLENI);
      setEditZId(null);
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri čuvanju.', 'error');
    }
  };

  const handleEditZaposleni = (z) => {
    setFormZ({
      ime: z.ime, prezime: z.prezime, korisnickoIme: z.korisnickoIme,
      lozinka: '', uloga: z.uloga || 'ZAPOSLENI'
    });
    setEditZId(z.idZaposleni);
    setTab('zaposleni');
  };

  const handleDeleteZaposleni = async (id, ime) => {
    if (!window.confirm(`Obrisati zaposlenog ${ime}?`)) return;
    try {
      await deleteZaposleni(id);
      showPoruka('✓ Zaposleni obrisan.');
      ucitajSve();
    } catch (e) {
      showPoruka(e.response?.data?.message || 'Greška pri brisanju.', 'error');
    }
  };

  const otkaziEdit = () => {
    setFormV(PRAZNA_VENCANICA); setEditVId(null);
    setFormG(PRAZAN_GRAD); setEditGId(null);
    setFormM(PRAZAN_MODEL); setEditMId(null);
    setFormK(PRAZAN_KLIJENT); setEditKId(null);
    setFormZ(PRAZAN_ZAPOSLENI); setEditZId(null);
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
        <button className={`tab ${tab === 'vencanice' ? 'active' : ''}`} onClick={() => { setTab('vencanice'); otkaziEdit(); }}>
          Venčanice ({vencanice.length})
        </button>
        <button className={`tab ${tab === 'iznajmljivanje' ? 'active' : ''}`} onClick={() => { setTab('iznajmljivanje'); otkaziEdit(); }}>
          Iznajmljivanja ({iznajmljivanja.length})
        </button>
        <button className={`tab ${tab === 'gradovi' ? 'active' : ''}`} onClick={() => { setTab('gradovi'); otkaziEdit(); }}>
          Gradovi ({gradovi.length})
        </button>
        <button className={`tab ${tab === 'modeli' ? 'active' : ''}`} onClick={() => { setTab('modeli'); otkaziEdit(); }}>
          Modeli ({modeli.length})
        </button>
        <button className={`tab ${tab === 'klijenti' ? 'active' : ''}`} onClick={() => { setTab('klijenti'); otkaziEdit(); }}>
          Klijenti ({klijenti.length})
        </button>
        <button className={`tab ${tab === 'zaposleni' ? 'active' : ''}`} onClick={() => { setTab('zaposleni'); otkaziEdit(); }}>
          Zaposleni ({zaposleni.length})
        </button>
      </div>

      {loading && <div className="loading">Učitavanje...</div>}

      {/* ── TAB: Vencanice ─────────────────────────────────── */}
      {tab === 'vencanice' && (
        <>
          <div className="admin-form">
            <h3>{editVId ? 'Izmeni venčanicu' : 'Dodaj novu venčanicu'}</h3>
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
              {editVId && (
                <div className="form-group">
                  <label>Status</label>
                  <p style={{ margin: '8px 0 0', fontStyle: 'italic', color: '#777' }}>
                    {formV.status === 0 ? 'Slobodna' : 'Iznajmljena'}
                    {' '}(status se menja isključivo kroz kreiranje/vraćanje iznajmljivanja)
                  </p>
                </div>
              )}
              <div className="form-group full">
                <label>Napomene</label>
                <input value={formV.napomene}
                  onChange={e => setFormV({ ...formV, napomene: e.target.value })}
                  placeholder="Opcione napomene..." />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSubmitVencanica}>
              {editVId ? 'Sačuvaj izmene' : '+ Dodaj venčanicu'}
            </button>
            {editVId && (
              <button className="btn" onClick={otkaziEdit} style={{ marginLeft: 8 }}>Otkaži</button>
            )}
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
                    <button className="btn btn-sm" onClick={() => handleEditVencanica(v)}>Izmeni</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteVencanica(v.idVencanica, v.serijskiBroj)}>
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
            <button className="btn btn-primary" onClick={handleSubmitIznajmljivanje}>
              {editIId ? 'Sačuvaj izmene' : '+ Kreiraj iznajmljivanje'}
            </button>
          </div>

          <h3>Aktivna iznajmljivanja ({iznajmljivanja.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Venčanica</th><th>Klijent</th>
                <th>Datum uzimanja</th><th>Datum vraćanja</th><th>Akcija</th>
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
                        {v && <span style={{ color: '#888', fontSize: '0.8rem', display: 'block' }}>vel. {v.velicina}</span>}
                      </td>
                      <td>
                        <strong>{k ? `${k.ime} ${k.prezime}` : `ID: ${i.klijentId}`}</strong>
                        {k && <span style={{ color: '#888', fontSize: '0.8rem', display: 'block' }}>{k.telefon}</span>}
                      </td>
                      <td>{i.datumUzimanja}</td>
                      <td>{i.datumVracanja}</td>
                      <td>
                        <button className="btn btn-sm" onClick={() => handleEditIznajmljivanje(i)}>Izmeni</button>{' '}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteIznajmljivanje(i.idIznajmljivanje)}>
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

      {/* ── TAB: Gradovi ─────────────────────────────────────── */}
      {tab === 'gradovi' && (
        <>
          <div className="admin-form">
            <h3>{editGId ? 'Izmeni grad' : 'Dodaj grad'}</h3>
            <div className="form-grid">
              <div className="form-group full">
                <label>Naziv *</label>
                <input value={formG.naziv}
                  onChange={e => setFormG({ ...formG, naziv: e.target.value })}
                  placeholder="Beograd" />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSubmitGrad}>
              {editGId ? 'Sačuvaj izmene' : '+ Dodaj grad'}
            </button>
            {editGId && <button className="btn" onClick={otkaziEdit} style={{ marginLeft: 8 }}>Otkaži</button>}
          </div>

          <h3>Svi gradovi ({gradovi.length})</h3>
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Naziv</th><th>Akcija</th></tr></thead>
            <tbody>
              {gradovi.map(g => (
                <tr key={g.idGrad}>
                  <td>{g.idGrad}</td>
                  <td>{g.naziv}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => handleEditGrad(g)}>Izmeni</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteGrad(g.idGrad, g.naziv)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ── TAB: Modeli ──────────────────────────────────────── */}
      {tab === 'modeli' && (
        <>
          <div className="admin-form">
            <h3>{editMId ? 'Izmeni model' : 'Dodaj model venčanice'}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Naziv *</label>
                <input value={formM.naziv} onChange={e => setFormM({ ...formM, naziv: e.target.value })} placeholder="Princess" />
              </div>
              <div className="form-group">
                <label>Dizajner</label>
                <input value={formM.dizajner} onChange={e => setFormM({ ...formM, dizajner: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Boja</label>
                <input value={formM.boja} onChange={e => setFormM({ ...formM, boja: e.target.value })} placeholder="Bela" />
              </div>
              <div className="form-group">
                <label>Materijal</label>
                <input value={formM.materijal} onChange={e => setFormM({ ...formM, materijal: e.target.value })} placeholder="Satin" />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSubmitModel}>
              {editMId ? 'Sačuvaj izmene' : '+ Dodaj model'}
            </button>
            {editMId && <button className="btn" onClick={otkaziEdit} style={{ marginLeft: 8 }}>Otkaži</button>}
          </div>

          <h3>Svi modeli ({modeli.length})</h3>
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Naziv</th><th>Dizajner</th><th>Boja</th><th>Materijal</th><th>Akcija</th></tr></thead>
            <tbody>
              {modeli.map(m => (
                <tr key={m.idModel}>
                  <td>{m.idModel}</td><td>{m.naziv}</td><td>{m.dizajner}</td><td>{m.boja}</td><td>{m.materijal}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => handleEditModel(m)}>Izmeni</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteModel(m.idModel, m.naziv)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ── TAB: Klijenti ────────────────────────────────────── */}
      {tab === 'klijenti' && (
        <>
          <div className="admin-form">
            <h3>{editKId ? 'Izmeni klijenta' : 'Dodaj klijenta'}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Ime *</label>
                <input value={formK.ime} onChange={e => setFormK({ ...formK, ime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Prezime *</label>
                <input value={formK.prezime} onChange={e => setFormK({ ...formK, prezime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Godine</label>
                <input type="number" value={formK.godine} onChange={e => setFormK({ ...formK, godine: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Telefon *</label>
                <input value={formK.telefon} onChange={e => setFormK({ ...formK, telefon: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={formK.email} onChange={e => setFormK({ ...formK, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Adresa</label>
                <input value={formK.adresa} onChange={e => setFormK({ ...formK, adresa: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Grad</label>
                <select value={formK.gradId} onChange={e => setFormK({ ...formK, gradId: e.target.value })}>
                  <option value="">Izaberi grad</option>
                  {gradovi.map(g => <option key={g.idGrad} value={g.idGrad}>{g.naziv}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSubmitKlijent}>
              {editKId ? 'Sačuvaj izmene' : '+ Dodaj klijenta'}
            </button>
            {editKId && <button className="btn" onClick={otkaziEdit} style={{ marginLeft: 8 }}>Otkaži</button>}
          </div>

          <h3>Svi klijenti ({klijenti.length})</h3>
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Ime</th><th>Telefon</th><th>Grad</th><th>Akcija</th></tr></thead>
            <tbody>
              {klijenti.map(k => (
                <tr key={k.idKlijent}>
                  <td>{k.idKlijent}</td>
                  <td>{k.ime} {k.prezime}</td>
                  <td>{k.telefon}</td>
                  <td>{gradMap[k.gradId]?.naziv || '-'}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => handleEditKlijent(k)}>Izmeni</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteKlijent(k.idKlijent, k.ime)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ── TAB: Zaposleni ───────────────────────────────────── */}
      {tab === 'zaposleni' && (
        <>
          <div className="admin-form">
            <h3>{editZId ? 'Izmeni zaposlenog' : 'Dodaj zaposlenog'}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Ime *</label>
                <input value={formZ.ime} onChange={e => setFormZ({ ...formZ, ime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Prezime *</label>
                <input value={formZ.prezime} onChange={e => setFormZ({ ...formZ, prezime: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Korisničko ime *</label>
                <input value={formZ.korisnickoIme} onChange={e => setFormZ({ ...formZ, korisnickoIme: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Lozinka {editZId ? '(ostavi prazno da ne menjaš)' : '*'}</label>
                <input type="password" value={formZ.lozinka} onChange={e => setFormZ({ ...formZ, lozinka: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Uloga</label>
                <select value={formZ.uloga} onChange={e => setFormZ({ ...formZ, uloga: e.target.value })}>
                  <option value="ZAPOSLENI">ZAPOSLENI</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleSubmitZaposleni}>
              {editZId ? 'Sačuvaj izmene' : '+ Dodaj zaposlenog'}
            </button>
            {editZId && <button className="btn" onClick={otkaziEdit} style={{ marginLeft: 8 }}>Otkaži</button>}
          </div>

          <h3>Svi zaposleni ({zaposleni.length})</h3>
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Ime</th><th>Korisničko ime</th><th>Uloga</th><th>Akcija</th></tr></thead>
            <tbody>
              {zaposleni.map(z => (
                <tr key={z.idZaposleni}>
                  <td>{z.idZaposleni}</td>
                  <td>{z.ime} {z.prezime}</td>
                  <td>{z.korisnickoIme}</td>
                  <td>{z.uloga}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => handleEditZaposleni(z)}>Izmeni</button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteZaposleni(z.idZaposleni, z.ime)}>Obriši</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}