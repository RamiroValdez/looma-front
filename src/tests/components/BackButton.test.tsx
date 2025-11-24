import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BackButton from "../../app/components/BackButton";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderBackButton(props = {}) {
  return render(
    <MemoryRouter>
      <BackButton {...props} />
    </MemoryRouter>
  );
}

describe("Componente BackButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el texto 'Volver'", () => {
    renderBackButton();
    expect(screen.getByText("Volver")).toBeInTheDocument();
  });

  it("llama a navigate(-1) si no se pasa prop 'to'", () => {
    renderBackButton();
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("llama a navigate con la ruta si se pasa prop 'to'", () => {
    renderBackButton({ to: "/home" });
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

});