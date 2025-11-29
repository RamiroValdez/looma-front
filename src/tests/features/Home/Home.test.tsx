import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Home from "../../../app/features/Home/Home";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../app/features/Home/hooks/useHomeWorks", () => ({
    useHomeWorks: () => ({
        loading: false,
        top10: [{ id: 1, title: "Libro Top", banner: "banner.jpg", categories: [], description: "desc" }],
        newReleases: [{ id: 2, title: "Nuevo", banner: "", categories: [], description: "desc" }],
        recentlyUpdated: [{ id: 3, title: "Actualizado", banner: "", categories: [], description: "desc" }],
        continueReading: [{ id: 4, title: "Leyendo", banner: "", categories: [], description: "desc" }],
        uniquePreferences: [{ id: 5, title: "Recomendado", banner: "", categories: [], description: "desc" }],
        bannerBooks: [{ id: 1, title: "Libro Top", banner: "banner.jpg", categories: [], description: "desc" }],
    }),
}));

// Mock del nuevo CategoryList para que Home no cargue el servicio real
vi.mock("../../../app/features/Home/CategoryList.tsx", () => ({
    CategoryList: () => <div data-testid="category-list">Fantasía - Ciencia Ficción</div>,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../../../app/features/Home/hooks/useScrollArrows", () => ({
    useScrollArrows: () => ({
        scrollRef: { current: null },
        showLeft: false,
        showRight: false,
        onScroll: vi.fn(),
        scroll: vi.fn(),
    }),
}));

vi.mock("../../../app/components/BannerHome", () => ({
    default: ({ books }: any) => <div data-testid="banner-home">{books[0]?.title}</div>,
}));
vi.mock("../../../app/components/WorkCarousel", () => ({
    default: ({ title, books, showPosition }: any) => (
        <div data-testid={`carousel-${title}`}>
            {title} - {books.map((b: any) => b.title).join(", ")}
            {showPosition && " (con posición)"}
        </div>
    ),
}));
vi.mock("../../../app/components/ScrollArrow", () => ({
    default: ({ direction }: any) => <button data-testid={`arrow-${direction}`}>{direction}</button>,
}));

describe("Home", () => {
    it("muestra el banner si hay libros para banner", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByTestId("banner-home")).toHaveTextContent("Libro Top");
    });

    it("muestra el carousel de Top 10 con posición", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByTestId("carousel-Top 10 en Argentina")).toHaveTextContent("Top 10 en Argentina - Libro Top (con posición)");
    });

    it("muestra el carousel de Seguir Leyendo si hay libros", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByTestId("carousel-Seguir Leyendo")).toHaveTextContent("Seguir Leyendo - Leyendo");
    });

    it("muestra el carousel de Recomendados para ti si hay libros", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByTestId("carousel-Recomendados para ti")).toHaveTextContent("Recomendados para ti - Recomendado");
    });

    it("muestra el carousel de Nuevos lanzamientos si hay libros", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByTestId("carousel-Nuevos lanzamientos")).toHaveTextContent("Nuevos lanzamientos - Nuevo");
    });

    it("muestra el carousel de Actualizados recientemente si hay libros", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByTestId("carousel-Actualizados recientemente")).toHaveTextContent("Actualizados recientemente - Actualizado");
    });
});
