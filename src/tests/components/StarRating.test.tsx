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
function getStarElements() {
  return document.querySelectorAll("div.cursor-pointer");
}
function clickOnStar(starIndex: number, isHalf: boolean = false) {
  const stars = getStarElements();
  const star = stars[starIndex - 1] as HTMLElement;

  // Mock getBoundingClientRect para simular dimensiones reales
  const mockRect = {
    left: 0,
    width: 32, // w-8 = 32px
    top: 0,
    bottom: 32,
    right: 32,
    height: 32,
    x: 0,
    y: 0,
    toJSON: () => {}
  };

  vi.spyOn(star, 'getBoundingClientRect').mockReturnValue(mockRect as DOMRect);

  // Calcular clientX basado en si queremos media estrella o estrella completa
  const clientX = isHalf ? mockRect.left + mockRect.width * 0.25 : mockRect.left + mockRect.width * 0.75;

  fireEvent.click(star, { clientX });
}

describe("Componente StarRating", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMyRatings.mockResolvedValue(0);
    mockGetRatingsCount.mockResolvedValue(10);
      mockSendRating.mockResolvedValue({ workId: 1, userId: 1, rating: 5, average_rating: 4.2 });
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
    await waitFor(() => getStarElements());
    clickOnStar(1, true);
    await waitFor(() => expect(mockSendRating).toHaveBeenCalledWith(1, 0.5));
  });

  it("actualiza el rating al hacer clic en una estrella", async () => {
    render(<StarRating workId={1} />);
    await waitFor(() => getStarElements());
    clickOnStar(5, false);
    await waitFor(() => expect(mockSendRating).toHaveBeenCalledWith(1, 5));
  });

  it("actualiza el promedio después de enviar rating", async () => {
    mockSendRating.mockResolvedValue({ workId: 1, userId: 1, rating: 5, average_rating: 4.5 });
    render(<StarRating workId={1} initialValue={4.0} />);
    await waitFor(() => getStarElements());
    clickOnStar(5, false);
    await waitFor(() => expectAverageValue("4.5"));
  });

  it("llama a sendRating al hacer clic en una estrella", async () => {
    render(<StarRating workId={1} />);
    await waitFor(() => getStarElements());
    clickOnStar(4, false);
    await waitFor(() => expect(mockSendRating).toHaveBeenCalledWith(1, 4));
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

  it("no muestra mensaje de error inicialmente", async () => {
    render(<StarRating workId={1} />);
    await waitFor(() => getStarElements());
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("no muestra mensaje de éxito si no se ha enviado", async () => {
    render(<StarRating workId={1} />);
    await waitFor(() => getStarElements());
    expect(screen.queryByText(/enviando/i)).not.toBeInTheDocument();
  });
});