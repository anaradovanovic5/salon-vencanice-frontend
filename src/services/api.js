import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// ── Grad ─────────────────────────────────────────────
export const getAllGradovi = () => API.get('/grad');

// ── ModelVencanice ───────────────────────────────────
export const getAllModeli = () => API.get('/model-vencanice');

// ── Zaposleni ────────────────────────────────────────
export const getAllZaposleni = () => API.get('/zaposleni');

// ── Klijent ──────────────────────────────────────────
export const getAllKlijenti = () => API.get('/klijent');

// ── Vencanica ────────────────────────────────────────
export const getAllVencanice = () => API.get('/vencanica');
export const getSlobodneVencanice = () => API.get('/vencanica/slobodne');
export const getVencaniceByVelicina = (velicina) =>
  API.get(`/vencanica/velicina?velicina=${velicina}`);
export const addVencanica = (data) => API.post('/vencanica', data);
export const deleteVencanica = (id) => API.delete(`/vencanica/${id}`);

// ── Iznajmljivanje ───────────────────────────────────
export const getAllIznajmljivanja = () => API.get('/iznajmljivanje');
export const getAktivnaIznajmljivanja = () => API.get('/iznajmljivanje/aktivna');
export const addIznajmljivanje = (data) => API.post('/iznajmljivanje', data);
export const deleteIznajmljivanje = (id) => API.delete(`/iznajmljivanje/${id}`);