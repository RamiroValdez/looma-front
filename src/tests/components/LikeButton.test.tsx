import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LikeButton from "../../app/components/LikeButton";

vi.mock("../../app/hooks/useLike", () => ({
  useLike: vi.fn(),
}));

import { useLike } from "../../app/hooks/useLike";

function expectHeartFill(container: HTMLElement, color: string) {
  const svg = container.querySelector("svg");
  expect(svg).toHaveAttribute("fill", color);
}

describe("LikeButton", () => {
  const mockHandleLike = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLike as any).mockReturnValue({
      liked: false,
      count: 0,
      loading: false,
      handleLike: mockHandleLike,
    });
  });

  it('cuando se renderiza, muestra el contador inicial correctamente', () => {
    // Dado
    (useLike as any).mockReturnValue({
      liked: false,
      count: 5,
      loading: false,
      handleLike: mockHandleLike,
    });
    // Cuando
    render(<LikeButton workId={1} />);
    // Entonces
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it('cuando el contador es mayor a 1000, lo muestra formateado en "k"', () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 1500,
      loading: false,
      handleLike: mockHandleLike,
    });
    render(<LikeButton workId={1} />);
    expect(screen.getByText("1.5k")).toBeInTheDocument();
  });

  it('cuando liked es true, muestra el corazón relleno', () => {
    (useLike as any).mockReturnValue({
      liked: true,
      count: 10,
      loading: false,
      handleLike: mockHandleLike,
    });
    const { container } = render(<LikeButton workId={1} />);
    expectHeartFill(container, "#c026d3");
  });

  it('cuando liked es false, muestra el corazón vacío', () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 10,
      loading: false,
      handleLike: mockHandleLike,
    });
    const { container } = render(<LikeButton workId={1} />);
    expectHeartFill(container, "none");
  });

  it('cuando se hace click en el botón, llama a handleLike', () => {
    render(<LikeButton workId={1} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockHandleLike).toHaveBeenCalled();
  });

  it('cuando loading es true, deshabilita el botón', () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 0,
      loading: true,
      handleLike: mockHandleLike,
    });
    render(<LikeButton workId={1} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it('cuando disabled es true, deshabilita el botón', () => {
    render(<LikeButton workId={1} disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it('cuando liked es false, usa el aria-label "Agregar like"', () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 0,
      loading: false,
      handleLike: mockHandleLike,
    });
    render(<LikeButton workId={1} />);
    expect(screen.getByLabelText("Agregar like")).toBeInTheDocument();
  });

  it('cuando liked es true, usa el aria-label "Quitar like"', () => {
    (useLike as any).mockReturnValue({
      liked: true,
      count: 0,
      loading: false,
      handleLike: mockHandleLike,
    });
    render(<LikeButton workId={1} />);
    expect(screen.getByLabelText("Quitar like")).toBeInTheDocument();
  });
});