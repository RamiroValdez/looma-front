import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StarRating from "../../app/components/StarRating";
import * as RatingService from "../../infrastructure/services/RatingService";

const mockGetMyRatings = vi.spyOn(RatingService, "getMyRatings");
const mockGetRatingsCount = vi.spyOn(RatingService, "getRatingsCount");
const mockSendRating = vi.spyOn(RatingService, "sendRating");

function expectAverageValue(value: string) {
  expect(screen.getByText((content) => content.trim() === value)).toBeInTheDocument();
}
function expectTotalValue(value: string) {
  expect(screen.getByText((content) => content.trim() === value)).toBeInTheDocument();
}
function expectButtonText(text: string) {
  expect(screen.getByRole("button", { name: new RegExp(text, "i") })).toBeInTheDocument();
}
function expectSuccessIcon() {
  const successIcon = document.querySelector('.text-green-600 svg');
  expect(successIcon).toBeInTheDocument();
}

describe("Componente StarRating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMyRatings.mockResolvedValue(0);
    mockGetRatingsCount.mockResolvedValue(10);
    mockSendRating.mockResolvedValue({ averageRating: 4.2 });
  });

  it("muestra el promedio inicial", async () => {
    render(<StarRating workId={1} initialValue={3.5} />);
    await waitFor(() => expectAverageValue("3.5"));
  });

  it("muestra el total de valoraciones", async () => {
    mockGetRatingsCount.mockResolvedValue(15);
    render(<StarRating workId={1} />);
    await waitFor(() => expectTotalValue("(15)"));
  });

  it("muestra las estrellas llenas según el rating inicial", async () => {
    mockGetMyRatings.mockResolvedValue(4);
    render(<StarRating workId={1} initialValue={4} />);
    await waitFor(() => {
      const filledStars = document.querySelectorAll('svg[fill="#FFD700"]');
      expect(filledStars.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("permite seleccionar media estrella", async () => {
    render(<StarRating workId={1} />);
    const starDiv = document.querySelectorAll("div[style*='inline-block']")[0];
    fireEvent.click(starDiv, { clientX: 0 });
  });

  it("deshabilita el botón de enviar si el rating es 0", async () => {
    render(<StarRating workId={1} />);
    const button = screen.getByRole("button", { name: /enviar valoración/i });
    expect(button).toBeDisabled();
  });

  it("muestra 'Enviando...' cuando loading es true", async () => {
    mockGetMyRatings.mockResolvedValue(5);
    render(<StarRating workId={1} initialValue={5} />);
    const button = await screen.findByRole("button", { name: /enviar valoración/i });
    fireEvent.click(button);
    await waitFor(() => expectButtonText("Enviando..."));
  });

  it("llama a sendRating al enviar", async () => {
    mockGetMyRatings.mockResolvedValue(5);
    render(<StarRating workId={1} initialValue={5} />);
    const button = await screen.findByRole("button", { name: /enviar valoración/i });
    fireEvent.click(button);
    await waitFor(() => expect(mockSendRating).toHaveBeenCalled());
  });

  it("muestra 0.0 si no hay valor inicial ni average", async () => {
    mockGetMyRatings.mockResolvedValue(0);
    render(<StarRating workId={1} />);
    await waitFor(() => expectAverageValue("0.0"));
  });

  it("muestra el total de valoraciones actualizado", async () => {
    mockGetRatingsCount.mockResolvedValue(42);
    render(<StarRating workId={1} />);
    await waitFor(() => expectTotalValue("(42)"));
  });

  it("muestra el icono de éxito tras enviar", async () => {
    mockGetMyRatings.mockResolvedValue(5);
    render(<StarRating workId={1} initialValue={5} />);
    const button = await screen.findByRole("button", { name: /enviar valoración/i });
    fireEvent.click(button);
    await waitFor(() => expectSuccessIcon());
  });

  it("no muestra mensaje de éxito si no se ha enviado", async () => {
    render(<StarRating workId={1} />);
    expect(screen.queryByText((content) => /enviando/i.test(content))).not.toBeInTheDocument();
  });
});