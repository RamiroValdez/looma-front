import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FooterLector from "../../app/components/FooterLector";   

const defaultProps = {
  selectedLanguages: [
    { code: "es", name: "Español" },
    { code: "en", name: "Inglés" },
  ],
  chapterTitle: "Capítulo 1",
  onLanguageChange: vi.fn(),
  disableLanguageSelect: false,
  onToggleFullScreen: vi.fn(),
  isFullScreen: false,
  onThemeClick: vi.fn(),
  isThemeModalOpen: false,
  onPreviousChapter: vi.fn(),
  onNextChapter: vi.fn(),
};

describe("Componente FooterLector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el título del capítulo", () => {
    render(<FooterLector {...defaultProps} />);
    expect(screen.getByText("Capítulo 1")).toBeInTheDocument();
  });

  it("muestra los idiomas en el select", () => {
    render(<FooterLector {...defaultProps} />);
    expect(screen.getByText("Español (ES)")).toBeInTheDocument();
    expect(screen.getByText("Inglés (EN)")).toBeInTheDocument();
  });

  it("llama a onLanguageChange al cambiar el idioma", () => {
    render(<FooterLector {...defaultProps} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "en" } });
    expect(defaultProps.onLanguageChange).toHaveBeenCalledWith("en");
  });

  it("deshabilita el select si disableLanguageSelect es true", () => {
    render(<FooterLector {...defaultProps} disableLanguageSelect={true} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("llama a onThemeClick al hacer click en 'Estilo'", () => {
    render(<FooterLector {...defaultProps} />);
    fireEvent.click(screen.getByText("Estilo"));
    expect(defaultProps.onThemeClick).toHaveBeenCalled();
  });

  it("llama a onPreviousChapter al hacer click en el botón anterior", () => {
    render(<FooterLector {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Capítulo anterior"));
    expect(defaultProps.onPreviousChapter).toHaveBeenCalled();
  });

  it("llama a onNextChapter al hacer click en el botón siguiente", () => {
    render(<FooterLector {...defaultProps} />);
    fireEvent.click(screen.getByLabelText("Capítulo siguiente"));
    expect(defaultProps.onNextChapter).toHaveBeenCalled();
  });

  it("llama a onToggleFullScreen al hacer click en el botón de pantalla", () => {
    render(<FooterLector {...defaultProps} />);
    fireEvent.click(screen.getByText("Screen"));
    expect(defaultProps.onToggleFullScreen).toHaveBeenCalled();
  });

  it("muestra el icono de pantalla completa si isFullScreen es false", () => {
    render(<FooterLector {...defaultProps} isFullScreen={false} />);
    expect(screen.getByText("Screen").previousSibling).toBeInTheDocument();
  });

  it("muestra el icono de salir de pantalla completa si isFullScreen es true", () => {
    render(<FooterLector {...defaultProps} isFullScreen={true} />);
    expect(screen.getByText("Screen").previousSibling).toBeInTheDocument();
  });

  it("aplica la clase z-[9999] si isThemeModalOpen es true", () => {
    const { container } = render(<FooterLector {...defaultProps} isThemeModalOpen={true} />);
    expect(container.querySelector("footer")).toHaveClass("z-[9999]");
  });

  it("aplica la clase z-50 si isThemeModalOpen es false", () => {
    const { container } = render(<FooterLector {...defaultProps} isThemeModalOpen={false} />);
    expect(container.querySelector("footer")).toHaveClass("z-50");
  });
});