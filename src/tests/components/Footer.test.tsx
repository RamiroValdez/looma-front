import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Footer from '../../app/components/Footer';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderFooter() {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

function expectBotonExplorarObrasVisible() {
  expect(screen.getByText('Explorar Obras')).toBeInTheDocument();
}

function expectBotonTerminosCondicionesVisible() {
  expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
}

function expectEmailVisible() {
  expect(screen.getByText('looma.tpi@gmail.com')).toBeInTheDocument();
}

function expectInstagramVisible() {
  expect(screen.getByText(/Instagram @looma/i)).toBeInTheDocument();
}

describe('Footer', () => {
  it('cuando se renderiza, muestra el botón "Explorar Obras"', () => {
    // Dado
    renderFooter();
    // Entonces
    expectBotonExplorarObrasVisible();
  });

  it('cuando se renderiza, muestra el botón "Términos y Condiciones"', () => {
    renderFooter();
    expectBotonTerminosCondicionesVisible();
  });

  it('cuando se renderiza, muestra el email de contacto', () => {
    renderFooter();
    expectEmailVisible();
  });

  it('cuando se renderiza, muestra el enlace de Instagram', () => {
    renderFooter();
    expectInstagramVisible();
  });

  it('cuando se hace click en "Explorar Obras", navega a /explore', () => {
    renderFooter();
    fireEvent.click(screen.getByText('Explorar Obras'));
    expect(mockNavigate).toHaveBeenCalledWith('/explore');
  });

  it('cuando se hace click en "Términos y Condiciones", navega a /terms', () => {
    renderFooter();
    fireEvent.click(screen.getByText('Términos y Condiciones'));
    expect(mockNavigate).toHaveBeenCalledWith('/terms');
  });
});