import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SubscriptionsPage } from '../../../app/features/Profile/SubscriptionsPage';
import '@testing-library/jest-dom';

// Mock del servicio
const mockGetSubscriptions = vi.fn();
vi.mock('../../../infrastructure/services/SubscriptionsService', () => ({
  GetSubscriptions: () => mockGetSubscriptions(),
}));

// Mock del ProfileMenu
vi.mock('../../../app/features/Profile/components/ProfileMenu', () => ({
  default: () => <div data-testid="profile-menu">Profile Menu</div>,
}));

// Mock del WorkItemSearch
vi.mock('../../../app/components/WorkItemSearch', () => ({
  WorkItemSearch: ({ work }: { work: any }) => (
    <div data-testid={`work-item-${work.id}`}>
      <h3>{work.title}</h3>
      <p>{work.description}</p>
      <span>{work.likes} likes</span>
      <span>{work.format?.name}</span>
    </div>
  ),
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      {children}
    </MemoryRouter>
  );
};

const mockSubscriptionsData = [
  {
    id: 1,
    title: "La Primera Obra",
    description: "Una descripción fascinante de la primera obra",
    cover: "cover1.jpg",
    likes: 150,
    format: { name: "novela" },
    categories: [
      { id: 1, name: "Ficción" },
      { id: 2, name: "Aventura" }
    ]
  },
  {
    id: 2,
    title: "La Segunda Historia",
    description: "Una historia increíble que te mantendrá en suspenso",
    cover: "cover2.jpg",
    likes: 89,
    format: { name: "cuento" },
    categories: [
      { id: 3, name: "Misterio" }
    ]
  }
];

describe("SubscriptionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el estado de carga inicialmente", async () => {
    // Simular una promesa que nunca se resuelve para mantener el estado de carga
    mockGetSubscriptions.mockImplementation(() => new Promise(() => {}));

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
    expect(screen.getByText("Cargando suscripciones...")).toBeInTheDocument();
  });

  it("renderiza correctamente la página con suscripciones", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(screen.getByText("Mis Suscripciones")).toBeInTheDocument();
    });

    expect(screen.getByTestId("profile-menu")).toBeInTheDocument();
    expect(screen.getByText("Obras y autores a los que estás suscrito")).toBeInTheDocument();
    expect(screen.getByText("2 obras disponibles")).toBeInTheDocument();
  });

  it("renderiza las obras de suscripción correctamente", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("work-item-1")).toBeInTheDocument();
      expect(screen.getByTestId("work-item-2")).toBeInTheDocument();
    });

    // Verificar contenido de las obras
    expect(screen.getByText("La Primera Obra")).toBeInTheDocument();
    expect(screen.getByText("La Segunda Historia")).toBeInTheDocument();
    expect(screen.getByText("150 likes")).toBeInTheDocument();
    expect(screen.getByText("89 likes")).toBeInTheDocument();
    expect(screen.getByText("novela")).toBeInTheDocument();
    expect(screen.getByText("cuento")).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay suscripciones", async () => {
    mockGetSubscriptions.mockResolvedValue([]);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Mis Suscripciones")).toBeInTheDocument();
    });

    expect(screen.getByText("0 obras disponibles")).toBeInTheDocument();
    expect(screen.getByText("No tienes suscripciones activas.")).toBeInTheDocument();
    
    // No debe mostrar el mensaje informativo cuando no hay suscripciones
    expect(screen.queryByText("Las suscripciones incluyen obras de autores suscritos y obras individuales")).not.toBeInTheDocument();
  });

  it("muestra mensaje informativo cuando hay suscripciones", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Mis Suscripciones")).toBeInTheDocument();
    });

    expect(screen.getByText("Las suscripciones incluyen obras de autores suscritos y obras individuales")).toBeInTheDocument();
  });

  it("maneja correctamente los errores de la API", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetSubscriptions.mockRejectedValue(new Error('Error de conexión'));

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Mis Suscripciones")).toBeInTheDocument();
    });

    // Debe mostrar 0 obras cuando hay error
    expect(screen.getByText("0 obras disponibles")).toBeInTheDocument();
    expect(screen.getByText("No tienes suscripciones activas.")).toBeInTheDocument();

    // Verificar que se registró el error en consola
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching subscriptions:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it("muestra el texto correcto para una sola obra", async () => {
    mockGetSubscriptions.mockResolvedValue([mockSubscriptionsData[0]]);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("1 obra disponible")).toBeInTheDocument();
    });

    expect(screen.queryByText("obras disponibles")).not.toBeInTheDocument();
  });

  it("renderiza el grid de obras correctamente", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      const grid = document.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4', 'gap-6');
    });
  });

  it("llama al servicio GetSubscriptions al montar el componente", async () => {
    mockGetSubscriptions.mockResolvedValue([]);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    expect(mockGetSubscriptions).toHaveBeenCalledTimes(1);
  });

  it("mantiene el estado de carga durante la petición", async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetSubscriptions.mockReturnValue(promise);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    // Debe mostrar carga inicialmente
    expect(screen.getByText("Cargando suscripciones...")).toBeInTheDocument();

    // Resolver la promesa
    resolvePromise!(mockSubscriptionsData);

    // Esperar a que se actualice
    await waitFor(() => {
      expect(screen.queryByText("Cargando suscripciones...")).not.toBeInTheDocument();
      expect(screen.getByText("Mis Suscripciones")).toBeInTheDocument();
    });
  });

  it("renderiza correctamente la estructura de layout", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<SubscriptionsPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      const mainContainer = document.querySelector('.flex.bg-gray-50.min-h-screen');
      expect(mainContainer).toBeInTheDocument();
      
      const contentArea = document.querySelector('.flex-1.p-6');
      expect(contentArea).toBeInTheDocument();
      
      const maxWidthContainer = document.querySelector('.max-w-6xl.mx-auto');
      expect(maxWidthContainer).toBeInTheDocument();
    });
  });
});