import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Subscriptions} from '../../../app/features/Profile/SubscriptionsPage';
import '@testing-library/jest-dom';

const mockGetSubscriptions = vi.fn();
vi.mock('../../../infrastructure/services/SubscriptionsService', () => ({
  GetSubscriptions: () => mockGetSubscriptions(),
}));

vi.mock('../../../app/features/Profile/components/ProfileMenu', () => ({
  default: () => <div data-testid="profile-menu">Profile Menu</div>,
}));

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

function expectLoadingText() {
  expect(screen.getByRole("status")).toBeInTheDocument();
}

function expectWorksCount(count: number) {
  const text = count === 1 ? "1 obra disponible" : `${count} obras disponibles`;
  expect(screen.getByText(text)).toBeInTheDocument();
}

function expectEmptyMessage() {
  expect(screen.getByText("No tienes suscripciones activas.")).toBeInTheDocument();
}

function expectServiceCall(times = 1) {
  expect(mockGetSubscriptions).toHaveBeenCalledTimes(times);
}

function expectConsoleError(spy: any) {
  expect(spy).toHaveBeenCalledWith('Error fetching subscriptions:', expect.any(Error));
}

describe("SubscriptionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  it("dado que está cargando, cuando se renderiza, entonces muestra el texto de carga", async () => {
    mockGetSubscriptions.mockImplementation(() => new Promise(() => {}));

    render(<Subscriptions />, { wrapper: createWrapper() });

    expectLoadingText();
  });

  it("dado que hay suscripciones, cuando se renderiza, entonces muestra el título de la página", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Mis Suscripciones")).toBeInTheDocument();
    });
  });

  it("dado que hay suscripciones, cuando se renderiza, entonces muestra la descripción de la página", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Obras y autores a los que estás suscrito")).toBeInTheDocument();
    });
  });

  it("dado que hay múltiples suscripciones, cuando se renderiza, entonces muestra el contador correcto", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expectWorksCount(2);
    });
  });

  it("dado que hay suscripciones, cuando se renderiza, entonces muestra la primera obra", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId("work-item-1")).toBeInTheDocument();
    });
  });

  it("dado que hay suscripciones, cuando se renderiza, entonces muestra el título de la primera obra", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("La Primera Obra")).toBeInTheDocument();
    });
  });

  it("dado que no hay suscripciones, cuando se renderiza, entonces muestra el contador en cero", async () => {
    mockGetSubscriptions.mockResolvedValue([]);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expectWorksCount(0);
    });
  });

  it("dado que no hay suscripciones, cuando se renderiza, entonces muestra el mensaje vacío", async () => {
    mockGetSubscriptions.mockResolvedValue([]);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expectEmptyMessage();
    });
  });

  it("dado que no hay suscripciones, cuando se renderiza, entonces no muestra el mensaje informativo", async () => {
    mockGetSubscriptions.mockResolvedValue([]);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.queryByText("Las suscripciones incluyen obras de autores suscritos y obras individuales")).not.toBeInTheDocument();
    });
  });

  it("dado que hay suscripciones, cuando se renderiza, entonces muestra el mensaje informativo", async () => {
    mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Las suscripciones incluyen obras de autores suscritos y obras individuales")).toBeInTheDocument();
    });
  });

  it("dado que la API falla, cuando se renderiza, entonces registra el error en consola", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetSubscriptions.mockRejectedValue(new Error('Error de conexión'));

    render(<Subscriptions/>, { wrapper: createWrapper() });

    await waitFor(() => {
      expectConsoleError(consoleSpy);
    });

    consoleSpy.mockRestore();
  });

  it("dado que la API falla, cuando se renderiza, entonces muestra mensaje vacío", async () => {
    mockGetSubscriptions.mockRejectedValue(new Error('Error de conexión'));

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expectEmptyMessage();
    });
  });

  it("dado que hay una sola suscripción, cuando se renderiza, entonces muestra el texto en singular", async () => {
    mockGetSubscriptions.mockResolvedValue([mockSubscriptionsData[0]]);

    render(<Subscriptions />, { wrapper: createWrapper() });

    await waitFor(() => {
      expectWorksCount(1);
    });
  });

it("dado que hay suscripciones, cuando se renderiza, entonces muestra el grid", async () => {
  mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

  render(<Subscriptions />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(document.querySelector('.flex.flex-row.flex-wrap.gap-6.mt-2')).toBeInTheDocument();
  });
});

  it("dado que el componente se monta, cuando se renderiza, entonces llama al servicio una vez", async () => {
    mockGetSubscriptions.mockResolvedValue([]);

    render(<Subscriptions />, { wrapper: createWrapper() });

    expectServiceCall(1);
  });

  it("dado que la petición está en progreso, cuando se renderiza, entonces muestra texto de carga", async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetSubscriptions.mockReturnValue(promise);

    render(<Subscriptions />, { wrapper: createWrapper() });

    expectLoadingText();

    resolvePromise!(mockSubscriptionsData);

    await waitFor(() => {
      expect(screen.queryByText("Cargando suscripciones...")).not.toBeInTheDocument();
    });
  });
it("dado que hay suscripciones, cuando se renderiza, entonces muestra el contenedor principal", async () => {
  mockGetSubscriptions.mockResolvedValue(mockSubscriptionsData);

  render(<Subscriptions />, { wrapper: createWrapper() });

  await waitFor(() => {
    expect(document.querySelector('.container')).toBeInTheDocument();
  });
});
});