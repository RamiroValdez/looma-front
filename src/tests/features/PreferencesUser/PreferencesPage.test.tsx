import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PreferencesPage from "../../../app/features/PreferencesUser/PreferencesPage";
import * as CategoryService from "../../../infrastructure/services/CategoryService";
import * as PreferencesHook from "../../../app/hooks/usePreferences";
import { BrowserRouter } from "react-router-dom";

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Componente PreferencesPage", () => {
  const mockToggleSelection = vi.fn();
  const mockHandleSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockUseCategories({
    categories = [],
    isLoading = false,
    error = null,
  }: { categories?: any[]; isLoading?: boolean; error?: string | null } = {}) {
    vi.spyOn(CategoryService, "useCategories").mockReturnValue({
      categories,
      isLoading,
      error,
    });
  }

  function mockUsePreferences({
    selectedGenres = [],
    sending = false,
    error = null,
  }: { selectedGenres?: string[]; sending?: boolean; error?: string | null } = {}) {
    vi.spyOn(PreferencesHook, "usePreferences").mockReturnValue({
      selectedGenres,
      sending,
      error,
      toggleSelection: mockToggleSelection,
      handleSubmit: mockHandleSubmit,
      setSelectedGenres: vi.fn(),
    });
  }

  it("muestra el mensaje de carga cuando las categorías están cargando", () => {
    mockUseCategories({ isLoading: true });
    mockUsePreferences();
    renderWithRouter(<PreferencesPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("muestra los botones de géneros cuando las categorías están disponibles", () => {
    const categorias = [
      { id: "1", name: "Fantasía" },
      { id: "2", name: "Ciencia Ficción" },
    ];
    mockUseCategories({ categories: categorias });
    mockUsePreferences();
    renderWithRouter(<PreferencesPage />);
    expect(screen.getByText("Fantasía")).toBeInTheDocument();
    expect(screen.getByText("Ciencia Ficción")).toBeInTheDocument();
  });

  it("llama a toggleSelection al hacer click en un género", () => {
    const categorias = [{ id: "1", name: "Fantasía" }];
    mockUseCategories({ categories: categorias });
    mockUsePreferences();
    renderWithRouter(<PreferencesPage />);
    fireEvent.click(screen.getByText("Fantasía"));
    expect(mockToggleSelection).toHaveBeenCalledWith("1");
  });

  it("muestra el error si existe", () => {
    mockUseCategories();
    mockUsePreferences({ error: "Error de prueba" });
    renderWithRouter(<PreferencesPage />);
    expect(screen.getByText("Error de prueba")).toBeInTheDocument();
  });

  it("el botón 'Continuar' está deshabilitado si no hay géneros seleccionados", () => {
    mockUseCategories({ categories: [{ id: "1", name: "Fantasía" }] });
    mockUsePreferences({ selectedGenres: [] });
    renderWithRouter(<PreferencesPage />);
    const boton = screen.getByRole("button", { name: /continuar/i });
    expect(boton).toBeDisabled();
  });

  it("el botón 'Continuar' está deshabilitado si está enviando", () => {
    mockUseCategories({ categories: [{ id: "1", name: "Fantasía" }] });
    mockUsePreferences({ selectedGenres: ["1"], sending: true });
    renderWithRouter(<PreferencesPage />);
    const boton = screen.getByRole("button", { name: /enviando/i });
    expect(boton).toBeDisabled();
  });

  it("el botón 'Continuar' está habilitado si hay géneros seleccionados y no está enviando", () => {
    mockUseCategories({ categories: [{ id: "1", name: "Fantasía" }] });
    mockUsePreferences({ selectedGenres: ["1"], sending: false });
    renderWithRouter(<PreferencesPage />);
    const boton = screen.getByRole("button", { name: /continuar/i });
    expect(boton).toBeEnabled();
  });

  it("llama a handleSubmit al hacer click en 'Continuar'", () => {
    mockUseCategories({ categories: [{ id: "1", name: "Fantasía" }] });
    mockUsePreferences({ selectedGenres: ["1"], sending: false });
    renderWithRouter(<PreferencesPage />);
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});