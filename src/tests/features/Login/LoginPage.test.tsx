import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { LoginPage } from "../../../app/features/Login/LoginPage";

const setEmail = vi.fn();
const setPassword = vi.fn();
const handleSubmit = vi.fn((e) => e.preventDefault());

vi.mock("../../../app/hooks/useLoginPage.ts", () => ({
  useLoginPage: () => ({
    email: "test@mail.com",
    setEmail,
    password: "123456",
    setPassword,
    loading: false,
    error: "",
    handleSubmit,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    setEmail.mockClear();
    setPassword.mockClear();
    handleSubmit.mockClear();
  });

  it("muestra los campos de correo, contraseña y el botón de inicio de sesión", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Iniciar sesión/i })).toBeInTheDocument();
  });

  it("muestra los valores actuales de email y contraseña en los inputs", () => {
    render(<LoginPage />);
    expect(screen.getByDisplayValue("test@mail.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456")).toBeInTheDocument();
  });

  it("llama a setEmail y setPassword cuando el usuario escribe en los campos", () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: "nuevo@mail.com" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "nueva" } });

    expect(setEmail).toHaveBeenCalledWith("nuevo@mail.com");
    expect(setPassword).toHaveBeenCalledWith("nueva");
  });

  it("ejecuta handleSubmit cuando el usuario envía el formulario", () => {
    render(<LoginPage />);
    fireEvent.submit(screen.getByRole("button", { name: /Iniciar sesión/i }).closest("form")!);
    expect(handleSubmit).toHaveBeenCalled();
  });
});