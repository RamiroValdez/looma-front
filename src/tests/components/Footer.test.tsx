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
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  it('muestra botones de navegación y secci��n de contacto', () => {
    renderFooter();
    expect(screen.getByText('Explorar Obras')).toBeInTheDocument();
    expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
    expect(screen.getByText('contacto@looma.com')).toBeInTheDocument();
    expect(screen.getByText(/Instagram @looma/i)).toBeInTheDocument();
  });

  it('navega a /explore al hacer click en Explorar Obras', () => {
    renderFooter();
    fireEvent.click(screen.getByText('Explorar Obras'));
    expect(mockNavigate).toHaveBeenCalledWith('/explore');
  });

  it('navega a /terms al hacer click en Términos y Condiciones', () => {
    renderFooter();
    fireEvent.click(screen.getByText('Términos y Condiciones'));
    expect(mockNavigate).toHaveBeenCalledWith('/terms');
  });
});

