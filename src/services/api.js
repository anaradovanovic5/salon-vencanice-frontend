import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// ── Interceptor: automatski kači JWT token na svaki zahtev ──
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor: ako token istekne/nevalidan je (401), izbaci na login ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('korisnickoIme');
      localStorage.removeItem('uloga');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// ── Grad ─────────────────────────────────────────────
export const getAllGradovi = () => API.get('/grad');
export const addGrad = (data) => API.post('/grad', data);
export const updateGrad = (id, data) => API.put(`/grad/${id}`, data);
export const deleteGrad = (id) => API.delete(`/grad/${id}`);

// ── ModelVencanice ───────────────────────────────────
export const getAllModeli = () => API.get('/model-vencanice');
export const addModel = (data) => API.post('/model-vencanice', data);
export const updateModel = (id, data) => API.put(`/model-vencanice/${id}`, data);
export const deleteModel = (id) => API.delete(`/model-vencanice/${id}`);

// ── Zaposleni ────────────────────────────────────────
export const getAllZaposleni = () => API.get('/zaposleni');
export const addZaposleni = (data) => API.post('/zaposleni', data);
export const updateZaposleni = (id, data) => API.put(`/zaposleni/${id}`, data);
export const deleteZaposleni = (id) => API.delete(`/zaposleni/${id}`);

// ── Klijent ──────────────────────────────────────────
export const getAllKlijenti = () => API.get('/klijent');
export const addKlijent = (data) => API.post('/klijent', data);
export const updateKlijent = (id, data) => API.put(`/klijent/${id}`, data);
export const deleteKlijent = (id) => API.delete(`/klijent/${id}`);

// ── Vencanica ────────────────────────────────────────
export const getAllVencanice = () => API.get('/vencanica');
export const getSlobodneVencanice = () => API.get('/vencanica/slobodne');
export const getVencaniceByVelicina = (velicina) =>
  API.get(`/vencanica/velicina?velicina=${velicina}`);
export const addVencanica = (data) => API.post('/vencanica', data);
export const updateVencanica = (id, data) => API.put(`/vencanica/${id}`, data);
export const deleteVencanica = (id) => API.delete(`/vencanica/${id}`);

// ── Iznajmljivanje ───────────────────────────────────
export const getAllIznajmljivanja = () => API.get('/iznajmljivanje');
export const getAktivnaIznajmljivanja = () => API.get('/iznajmljivanje/aktivna');
export const addIznajmljivanje = (data) => API.post('/iznajmljivanje', data);
export const updateIznajmljivanje = (id, data) => API.put(`/iznajmljivanje/${id}`, data);
export const deleteIznajmljivanje = (id) => API.delete(`/iznajmljivanje/${id}`);
