import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "../../../app/features/Register/RegisterPage";
import * as useRegisterModule from "../../../app/hooks/useRegister";
import { BrowserRouter } from "react-router-dom";

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

function expectInputValue(label: string, value: string) {
  const input = screen.getByLabelText(label);
  expect(input).toHaveValue(value);
}

function expectErrorVisible(msg: string) {
  expect(screen.getByText(msg)).toBeInTheDocument();
}

describe("Componente RegisterPage", () => {
  const mockHandleChange = vi.fn();
  const mockHandleSubmit = vi.fn((e) => e.preventDefault());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function mockUseRegister({
    formData = {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    errors = {},
    loading = false,
  }: {
    formData?: any;
    errors?: any;
    loading?: boolean;
  } = {}) {
    vi.spyOn(useRegisterModule, "useRegister").mockReturnValue({
      formData,
      errors: {
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        ...errors,
      },
      loading,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
    });
  }

  it("muestra todos los campos del formulario", () => {

    mockUseRegister();
    renderWithRouter(<RegisterPage />);
    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Apellido")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre de usuario")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar contraseña")).toBeInTheDocument();
    expect(screen.getByLabelText(/He leído y acepto/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
  });

  it("deshabilita el botón cuando loading es true", () => {
    mockUseRegister({ loading: true });
    renderWithRouter(<RegisterPage />);
    expect(screen.getByRole("button", { name: /registrando/i })).toBeDisabled();
  });

  it("muestra el valor de los campos correctamente", () => {
    const formData = {
      name: "Juan",
      surname: "Pérez",
      username: "juanp",
      email: "juan@mail.com",
      password: "123456",
      confirmPassword: "123456",
    };
    mockUseRegister({ formData });
    renderWithRouter(<RegisterPage />);
    expectInputValue("Nombre", "Juan");
    expectInputValue("Apellido", "Pérez");
    expectInputValue("Nombre de usuario", "juanp");
    expectInputValue("Correo electrónico", "juan@mail.com");
    expectInputValue("Contraseña", "123456");
    expectInputValue("Confirmar contraseña", "123456");
  });

  it("llama a handleChange al cambiar un campo", () => {
    mockUseRegister();
    renderWithRouter(<RegisterPage />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Ana" } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

it("llama a handleSubmit al enviar el formulario", () => {
  mockUseRegister();
  renderWithRouter(<RegisterPage />);
  const form = document.querySelector("form");
  fireEvent.submit(form!);
  expect(mockHandleSubmit).toHaveBeenCalled();
});
  it("muestra los mensajes de error correspondientes", () => {
    const errors = {
      name: "El nombre es obligatorio",
      surname: "El apellido es obligatorio",
      username: "El usuario ya existe",
      email: "El correo ya está registrado",
      password: "La contraseña es débil",
      confirmPassword: "Las contraseñas no coinciden",
    };
    mockUseRegister({ errors });
    renderWithRouter(<RegisterPage />);
    expectErrorVisible("El nombre es obligatorio");
    expectErrorVisible("El apellido es obligatorio");
    expectErrorVisible("El usuario ya existe");
    expectErrorVisible("El correo ya está registrado");
    expectErrorVisible("La contraseña es débil");
    expectErrorVisible("Las contraseñas no coinciden");
  });

  it("deshabilita el botón si el formulario está incompleto", () => {
    mockUseRegister({
      formData: {
        name: "",
        surname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });
    renderWithRouter(<RegisterPage />);
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeDisabled();
  });

  it("habilita el botón si el formulario está completo y términos aceptados", () => {
    mockUseRegister({
      formData: {
        name: "Ana",
        surname: "López",
        username: "analopez",
        email: "ana@mail.com",
        password: "123456",
        confirmPassword: "123456",
      },
    });
    renderWithRouter(<RegisterPage />);
    fireEvent.click(screen.getByLabelText(/He leído y acepto/i));
    expect(screen.getByRole("button", { name: /registrarse/i })).toBeEnabled();
  });

  
});