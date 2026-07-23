import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [korisnickoIme, setKorisnickoIme] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreska('');
    if (!korisnickoIme || !lozinka) {
      setGreska('Unesi korisničko ime i lozinku.');
      return;
    }
    setLoading(true);
    try {
      const res = await login({ korisnickoIme, lozinka });
      const { token, korisnickoIme: ime, uloga } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('korisnickoIme', ime);
      localStorage.setItem('uloga', uloga);
      navigate('/admin');
    } catch (err) {
      setGreska(err.response?.data?.message || 'Pogrešno korisničko ime ili lozinka.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1>Prijava</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        {greska && <div className="poruka error">{greska}</div>}
        <div className="form-group">
          <label htmlFor="korisnickoIme">Korisničko ime</label>
          <input
            id="korisnickoIme"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
            placeholder="npr. ana.admin"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="lozinka">Lozinka</label>
          <input
            id="lozinka"
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Prijavljivanje...' : 'Prijavi se'}
        </button>
      </form>
    </div>
  );
}