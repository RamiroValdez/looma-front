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
  expect(screen.getByText('políticas y condiciones')).toBeInTheDocument();
}

function expectEmailVisible() {
  expect(screen.getByText('looma.tpi@gmail.com')).toBeInTheDocument();
}

function expectInstagramVisible() {
  expect(screen.getByText('Instagram @looma.ar')).toBeInTheDocument();
}

describe('Footer', () => {
  it('cuando se renderiza, muestra el botón "Explorar Obras"', () => {
    renderFooter();
    expectBotonExplorarObrasVisible();
  });

  it('cuando se renderiza, muestra el enlace de "políticas y condiciones"', () => {
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

  it('cuando se hace click en "políticas y condiciones", navega a /terms', () => {
    renderFooter();
    fireEvent.click(screen.getByText('políticas y condiciones'));
    // Este es un enlace <a>, no usa navigate, va directamente a /terms
    expect(screen.getByText('políticas y condiciones')).toHaveAttribute('href', '/terms');
  });
});