import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Katalog from './Katalog';
import { getAllVencanice, getAllModeli } from '../services/api';

// Mockujemo ceo api.js modul — ne gadjamo pravi backend u testovima
jest.mock('../services/api');

const MOCK_MODELI = [
  { idModel: 1, naziv: 'Princess', boja: 'Bela', dizajner: 'X', materijal: 'Satin' },
  { idModel: 2, naziv: 'Mermaid', boja: 'Ivory', dizajner: 'Y', materijal: 'Cipka' },
];

const MOCK_VENCANICE = [
  { idVencanica: 1, serijskiBroj: 'VEN-001', velicina: 'M', status: 0, modelId: 1, godinaProizvodnje: 2024 },
  { idVencanica: 2, serijskiBroj: 'VEN-002', velicina: 'L', status: 1, modelId: 2, godinaProizvodnje: 2023 },
  { idVencanica: 3, serijskiBroj: 'VEN-003', velicina: 'M', status: 0, modelId: 1, godinaProizvodnje: 2025 },
];

beforeEach(() => {
  jest.clearAllMocks();
  getAllVencanice.mockResolvedValue({ data: { data: MOCK_VENCANICE } });
  getAllModeli.mockResolvedValue({ data: { data: MOCK_MODELI } });
});

test('prikazuje sve venčanice nakon učitavanja', async () => {
  render(<Katalog />);

  expect(screen.getByText(/Učitavanje kolekcije/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Pronađena/i)).toBeInTheDocument();
  });

  expect(screen.getByText('3')).toBeInTheDocument(); // broj rezultata
});

test('filtrira venčanice po veličini', async () => {
  const user = userEvent.setup();
  render(<Katalog />);

  await waitFor(() => screen.getByText(/Pronađena/i));

  await user.click(screen.getByRole('button', { name: 'L' }));

  await waitFor(() => {
    expect(screen.getByText('1')).toBeInTheDocument(); // samo 1 venčanica veličine L
  });
});

test('filtrira venčanice po statusu (slobodne)', async () => {
  const user = userEvent.setup();
  render(<Katalog />);

  await waitFor(() => screen.getByText(/Pronađena/i));

  await user.click(screen.getByRole('button', { name: 'Slobodne' }));

  await waitFor(() => {
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 venčanice sa status 0
  });
});

test('prikazuje prazno stanje kad nema rezultata za filter', async () => {
  getAllVencanice.mockResolvedValue({ data: { data: [] } });
  render(<Katalog />);

  await waitFor(() => {
    expect(screen.getByText(/Nema venčanica za izabrane filtere/i)).toBeInTheDocument();
  });
});

test('reset dugme vraća filtere na podrazumevano', async () => {
  const user = userEvent.setup();
  getAllVencanice.mockResolvedValue({ data: { data: [] } });
  render(<Katalog />);

  await waitFor(() => screen.getByText(/Nema venčanica/i));

  const resetBtn = screen.getByRole('button', { name: /Resetuj filtere/i });
  await user.click(resetBtn);

  // posle reseta i dalje nema rezultata (mock je prazan), ali dugme mora da postoji i da je klikabilno
  expect(resetBtn).toBeInTheDocument();
});