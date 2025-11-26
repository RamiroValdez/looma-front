import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogin, useRegister } from '../../infrastructure/services/AuthService';
import { apiRequest } from '../../infrastructure/api/apiClient';

vi.mock('../../infrastructure/api/apiClient', () => ({
  apiRequest: vi.fn()
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_AUTH_URL: '/auth',
    VITE_API_BASE_URL: ''
  },
  configurable: true
});

const expectSuccessfulLoginResponse = (result: any, expectedData: any) => {
  expect(result.token).toBe(expectedData.token);
  expect(result.userId).toBe(expectedData.userId);
  expect(result.email).toBe(expectedData.email);
  expect(result.name).toBe(expectedData.name);
  expect(result.surname).toBe(expectedData.surname);
  expect(result.username).toBe(expectedData.username);
};

const expectApiRequestCalledWith = (url: string, method: string, data: any) => {
  expect(apiRequest).toHaveBeenCalledWith({
    url,
    method,
    data
  });
};

const expectFetchCalledWith = (url: string, method: string, body: any) => {
  expect(mockFetch).toHaveBeenCalledWith(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
};

const expectSuccessfulRegisterResponse = (result: any, expectedStatus: number) => {
  expect(result.status).toBe(expectedStatus);
  expect(result.data).toBeDefined();
};

const expectErrorThrownWithStatus = async (serviceCall: () => Promise<any>, expectedMessage: string, expectedStatus?: number) => {
  try {
    await serviceCall();
    expect.fail('Expected error to be thrown');
  } catch (error: any) {
    expect(error.message).toBe(expectedMessage);
    if (expectedStatus) {
      expect(error.status).toBe(expectedStatus);
    }
  }
};

const expectLoginDataStructure = (email: string, password: string) => {
  const lastCall = vi.mocked(apiRequest).mock.calls[vi.mocked(apiRequest).mock.calls.length - 1];
  expect(lastCall[0].data).toEqual({
    email,
    password
  });
};

const expectRegisterDataStructure = (data: any) => {
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  const body = JSON.parse(lastCall[1].body);
  expect(body).toEqual(data);
};

const setupSuccessfulLoginResponse = (responseData: any) => {
  vi.mocked(apiRequest).mockResolvedValue(responseData);
};

const setupFailedLoginResponse = (error: any) => {
  vi.mocked(apiRequest).mockRejectedValue(error);
};

const setupSuccessfulRegisterResponse = (status: number, data: any) => {
  mockFetch.mockResolvedValue({
    ok: true,
    status,
    json: vi.fn().mockResolvedValue(data)
  });
};

const setupFailedRegisterResponse = (status: number, message: string, data?: any) => {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    statusText: 'Bad Request',
    json: vi.fn().mockResolvedValue({ message, ...data })
  });
};

const setupNetworkError = () => {
  mockFetch.mockRejectedValue(new Error('Network error'));
};

const setupRegisterJsonError = () => {
  mockFetch.mockResolvedValue({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
    json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
  });
};

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useLogin', () => {
    describe('Casos de éxito', () => {
      it('dado que credenciales son válidas, cuando se ejecuta login, entonces llama al endpoint correcto', async () => {
        const mockResponse = {
          token: 'valid-jwt-token',
          userId: 123,
          email: 'test@example.com',
          name: 'John',
          surname: 'Doe',
          username: 'johndoe'
        };
        setupSuccessfulLoginResponse(mockResponse);

        await useLogin('test@example.com', 'password123');

        expectApiRequestCalledWith('/auth/login', 'POST', {
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('dado que credenciales son válidas, cuando se ejecuta login, entonces genera estructura de datos correcta', async () => {
        const mockResponse = {
          token: 'valid-jwt-token',
          userId: 123,
          email: 'test@example.com',
          name: 'John',
          surname: 'Doe',
          username: 'johndoe'
        };
        setupSuccessfulLoginResponse(mockResponse);

        await useLogin('test@example.com', 'password123');

        expectLoginDataStructure('test@example.com', 'password123');
      });

      it('dado que backend responde exitosamente, cuando se ejecuta login, entonces retorna respuesta completa', async () => {
        const mockResponse = {
          token: 'valid-jwt-token',
          userId: 123,
          email: 'test@example.com',
          name: 'John',
          surname: 'Doe',
          username: 'johndoe'
        };
        setupSuccessfulLoginResponse(mockResponse);

        const result = await useLogin('test@example.com', 'password123');

        expectSuccessfulLoginResponse(result, mockResponse);
      });
    });

    describe('Manejo de errores', () => {
      it('dado que credenciales son inválidas, cuando se ejecuta login, entonces propaga error de autenticación', async () => {
        const authError = new Error('Invalid credentials');
        setupFailedLoginResponse(authError);

        await expectErrorThrownWithStatus(
          () => useLogin('test@example.com', 'wrongpassword'),
          'Invalid credentials'
        );
      });

      it('dado que hay error de red, cuando se ejecuta login, entonces propaga error de conexión', async () => {
        const networkError = new Error('Network timeout');
        setupFailedLoginResponse(networkError);

        await expectErrorThrownWithStatus(
          () => useLogin('test@example.com', 'password123'),
          'Network timeout'
        );
      });
    });
  });

  describe('useRegister', () => {
    describe('Casos de éxito', () => {
      it('dado que datos son válidos, cuando se ejecuta register, entonces llama al endpoint correcto', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe', 
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };
        setupSuccessfulRegisterResponse(201, { message: 'User created successfully' });

        await useRegister(registerData);

        expectFetchCalledWith(
          '/auth/register',
          'POST',
          registerData
        );
      });

      it('dado que datos son válidos, cuando se ejecuta register, entonces genera estructura de datos correcta', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe', 
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };
        setupSuccessfulRegisterResponse(201, { message: 'User created successfully' });

        await useRegister(registerData);

        expectRegisterDataStructure(registerData);
      });

      it('dado que backend responde exitosamente, cuando se ejecuta register, entonces retorna respuesta con status', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          email: 'john@example.com', 
          password: 'password123',
          confirmPassword: 'password123'
        };
        const mockResponseData = { message: 'User created successfully', userId: 456 };
        setupSuccessfulRegisterResponse(201, mockResponseData);

        const result = await useRegister(registerData);

        expectSuccessfulRegisterResponse(result, 201);
        expect(result.data).toEqual(mockResponseData);
      });
    });

    describe('Manejo de errores con datos específicos', () => {
      it('dado que email ya existe, cuando se ejecuta register, entonces lanza error con status 400', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          email: 'existing@example.com',
          password: 'password123', 
          confirmPassword: 'password123'
        };
        setupFailedRegisterResponse(400, 'Email already exists', { field: 'email' });

        await expectErrorThrownWithStatus(
          () => useRegister(registerData),
          'Email already exists',
          400
        );
      });

      it('dado que username ya existe, cuando se ejecuta register, entonces lanza error con status 400', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'existinguser',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };
        setupFailedRegisterResponse(400, 'Username already exists', { field: 'username' });

        await expectErrorThrownWithStatus(
          () => useRegister(registerData),
          'Username already exists',
          400
        );
      });

      it('dado que datos son inválidos, cuando se ejecuta register, entonces lanza error con status 422', async () => {
        const registerData = {
          name: '',
          surname: 'Doe',
          username: 'johndoe',
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456'
        };
        setupFailedRegisterResponse(422, 'Validation failed', { 
          errors: ['Name is required', 'Invalid email', 'Passwords do not match']
        });

        await expectErrorThrownWithStatus(
          () => useRegister(registerData),
          'Validation failed',
          422
        );
      });
    });

    describe('Manejo de errores de conexión', () => {
      it('dado que hay error de red, cuando se ejecuta register, entonces lanza error de conexión', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };
        setupNetworkError();

        await expectErrorThrownWithStatus(
          () => useRegister(registerData),
          'Network error'
        );
      });

      it('dado que respuesta JSON es inválida, cuando se ejecuta register, entonces usa mensaje por defecto', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };
        setupRegisterJsonError();

        await expectErrorThrownWithStatus(
          () => useRegister(registerData),
          'Error al registrarse',
          500
        );
      });
    });

    describe('Casos edge de respuesta', () => {
      it('dado que respuesta no tiene mensaje, cuando falla register, entonces usa mensaje por defecto', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };
        setupFailedRegisterResponse(400, '', {}); // Sin mensaje

        await expectErrorThrownWithStatus(
          () => useRegister(registerData),
          'Error al registrarse',
          400
        );
      });

      it('dado que respuesta tiene status 500, cuando falla register, entonces incluye datos del error', async () => {
        const registerData = {
          name: 'John',
          surname: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        };
        
        try {
          setupFailedRegisterResponse(500, 'Internal server error', { trace: 'stack-trace' });
          await useRegister(registerData);
          expect.fail('Expected error to be thrown');
        } catch (error: any) {
          expect(error.status).toBe(500);
          expect(error.data).toEqual({ message: 'Internal server error', trace: 'stack-trace' });
        }
      });
    });
  });
});