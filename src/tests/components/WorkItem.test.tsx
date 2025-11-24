import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkItem } from "../../app/components/WorkItem";
import { MemoryRouter } from "react-router-dom";
import type { WorkDTO } from "../../domain/dto/WorkDTO";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockWork: WorkDTO = {
  id: 1,
  title: "Obra de Prueba",
  description: "Descripción de la obra de prueba.",
  cover: "/img/cover.png",
  banner: "/img/banner.png",
  state: "InProgress",
  createdAt: "2025-11-01T00:00:00Z",
  updatedAt: "2025-11-10T00:00:00Z",
  publicationDate: "2025-11-23",
  format: { id: 1, name: "Novela" },
  originalLanguage: { id: 1, name: "Español" },
  price: 0,
  likes: 0,
  creator: { id: 1, name: "Autor", surname: "Apellido", username: "autor1" },
  chapters: [],
  categories: [
    { id: 1, name: "Fantasía" },
    { id: 2, name: "Aventura" },
  ],
  tags: [],
  subscribedToAuthor: false,
  subscribedToWork: false,
  unlockedChapters: [],
  likedByUser: false,
  averageRating: 0,
};

function renderWorkItem(work: WorkDTO = mockWork) {
  return render(
    <MemoryRouter>
      <WorkItem work={work} />
    </MemoryRouter>
  );
}

describe("Componente WorkItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el título de la obra", () => {
    renderWorkItem();
    expect(screen.getByText("Obra de Prueba")).toBeInTheDocument();
  });

  it("muestra la descripción de la obra", () => {
    renderWorkItem();
    expect(screen.getByText("Descripción de la obra de prueba.")).toBeInTheDocument();
  });

  it("muestra la imagen de portada con alt correcto", () => {
    renderWorkItem();
    const img = screen.getByAltText("Portada de Obra de Prueba");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/img/cover.png");
  });

  it("muestra las categorías como tags", () => {
    renderWorkItem();
    expect(screen.getByText("Fantasía")).toBeInTheDocument();
    expect(screen.getByText("Aventura")).toBeInTheDocument();
  });

  it("muestra la fecha de publicación", () => {
    renderWorkItem();
    expect(screen.getByText(/Fecha de creación: 2025-11-23/)).toBeInTheDocument();
  });

  it("navega a la ruta de gestión al hacer click", () => {
    renderWorkItem();
    fireEvent.click(screen.getByRole("img").parentElement!);
    expect(mockNavigate).toHaveBeenCalledWith("/manage-work/1");
  });
});