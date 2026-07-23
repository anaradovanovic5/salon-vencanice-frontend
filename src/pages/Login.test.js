import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { login } from '../services/api';

jest.mock('../services/api');

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test('prikazuje grešku ako su polja prazna', async () => {
  const user = userEvent.setup();
  renderLogin();

  await user.click(screen.getByRole('button', { name: /Prijavi se/i }));

  expect(screen.getByText(/Unesi korisničko ime i lozinku/i)).toBeInTheDocument();
  expect(login).not.toHaveBeenCalled();
});

test('uspešna prijava čuva token i podatke u localStorage', async () => {
  const user = userEvent.setup();
  login.mockResolvedValue({
    data: {
      data: { token: 'fake-jwt-token', korisnickoIme: 'ana.admin', uloga: 'ADMIN' }
    }
  });

  renderLogin();

  await user.type(screen.getByLabelText(/Korisničko ime/i), 'ana.admin');
  await user.type(screen.getByLabelText(/Lozinka/i), 'tajna123');
  await user.click(screen.getByRole('button', { name: /Prijavi se/i }));

  await waitFor(() => {
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
  });
  expect(localStorage.getItem('korisnickoIme')).toBe('ana.admin');
  expect(localStorage.getItem('uloga')).toBe('ADMIN');
});

test('prikazuje grešku pri pogrešnim kredencijalima', async () => {
  const user = userEvent.setup();
  login.mockRejectedValue({
    response: { data: { message: 'Pogresno korisnicko ime ili lozinka.' } }
  });

  renderLogin();

  await user.type(screen.getByLabelText(/Korisničko ime/i), 'ana.admin');
  await user.type(screen.getByLabelText(/Lozinka/i), 'pogresna');
  await user.click(screen.getByRole('button', { name: /Prijavi se/i }));

  await waitFor(() => {
    expect(screen.getByText(/Pogresno korisnicko ime ili lozinka/i)).toBeInTheDocument();
  });
  expect(localStorage.getItem('token')).toBeNull();
});