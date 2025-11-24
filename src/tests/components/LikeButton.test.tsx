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

describe("Componente LikeButton", () => {
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

  it("muestra el contador inicial correctamente", () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 5,
      loading: false,
      handleLike: mockHandleLike,
    });
    render(<LikeButton workId={1} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("muestra el contador formateado en 'k' si es mayor a 1000", () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 1500,
      loading: false,
      handleLike: mockHandleLike,
    });
    render(<LikeButton workId={1} />);
    expect(screen.getByText("1.5k")).toBeInTheDocument();
  });

  it("muestra el corazón relleno si liked es true", () => {
    (useLike as any).mockReturnValue({
      liked: true,
      count: 10,
      loading: false,
      handleLike: mockHandleLike,
    });
    const { container } = render(<LikeButton workId={1} />);
    expectHeartFill(container, "#c026d3");
  });

  it("muestra el corazón vacío si liked es false", () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 10,
      loading: false,
      handleLike: mockHandleLike,
    });
    const { container } = render(<LikeButton workId={1} />);
    expectHeartFill(container, "none");
  });

  it("llama a handleLike al hacer click", () => {
    render(<LikeButton workId={1} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockHandleLike).toHaveBeenCalled();
  });

  it("deshabilita el botón si loading es true", () => {
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

  it("deshabilita el botón si disabled es true", () => {
    render(<LikeButton workId={1} disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("usa el aria-label correcto según el estado", () => {
    (useLike as any).mockReturnValue({
      liked: false,
      count: 0,
      loading: false,
      handleLike: mockHandleLike,
    });
    render(<LikeButton workId={1} />);
    expect(screen.getByLabelText("Dar like")).toBeInTheDocument();

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