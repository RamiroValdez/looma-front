import { describe, it, expect, vi, beforeEach } from 'vitest';
import { translateContent } from '../../infrastructure/services/TranslateService';
import { useAuthStore } from '../../infrastructure/store/AuthStore';

vi.mock('../../infrastructure/store/AuthStore', () => ({
  useAuthStore: {
    getState: vi.fn()
  }
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();
console.log = mockConsoleLog;
console.error = mockConsoleError;

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: '',
    VITE_API_TRANSLATION_URL: '/translation'
  },
  configurable: true
});

const expectSuccessfulTranslation = (result: string, expected: string) => {
  expect(result).toBe(expected);
};

const expectTranslationRequestBody = (sourceLanguage: string, targetLanguage: string, originalText: string) => {
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  const body = JSON.parse(lastCall[1].body);
  expect(body).toEqual({
    sourceLanguage,
    targetLanguage,
    originalText
  });
};

const expectAuthTokenUsed = (token: string) => {
  expect(useAuthStore.getState).toHaveBeenCalled();
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  expect(lastCall[1].headers.Authorization).toBe(`Bearer ${token}`);
};

const expectCorrectTranslationUrl = () => {
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  expect(lastCall[0]).toBe('/translation/create-version');
};

const expectErrorThrownWithMessage = async (serviceCall: () => Promise<any>, expectedMessage: string) => {
  await expect(serviceCall).rejects.toThrow(expectedMessage);
};

const expectConsoleLogCalled = (message: string) => {
  expect(mockConsoleLog).toHaveBeenCalledWith(message, expect.anything());
};

const expectConsoleErrorCalled = (message: string) => {
  expect(mockConsoleError).toHaveBeenCalledWith(message, expect.anything());
};

const expectNoAuthTokenUsed = () => {
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  expect(lastCall[1].headers.Authorization).toBeUndefined();
};

const setupAuthToken = (token: string) => {
  vi.mocked(useAuthStore.getState).mockReturnValue({
    token,
    isAuthenticated: !!token,
    setToken: vi.fn(),
    logout: vi.fn()
  });
};

const setupJsonResponse = (translatedText: string) => {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Map([['Content-Type', 'application/json']]),
    json: vi.fn().mockResolvedValue({ translatedText })
  });
};

const setupTextResponse = (textContent: string) => {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Map([['Content-Type', 'text/plain']]),
    text: vi.fn().mockResolvedValue(textContent)
  });
};

const setupJsonResponseWithoutTranslatedText = (responseData: any) => {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Map([['Content-Type', 'application/json']]),
    json: vi.fn().mockResolvedValue(responseData)
  });
};

const setupFailedResponse = (status: number, message?: string) => {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    statusText: 'Error',
    text: vi.fn().mockResolvedValue(message || '')
  });
};

const setupForbiddenResponse = () => {
  mockFetch.mockResolvedValue({
    ok: false,
    status: 403,
    statusText: 'Forbidden',
    text: vi.fn().mockResolvedValue('Forbidden access')
  });
};

const setupServerErrorResponse = () => {
  mockFetch.mockResolvedValue({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error',
    text: vi.fn().mockResolvedValue('Server error')
  });
};

const setupNetworkError = () => {
  mockFetch.mockRejectedValue(new Error('Network connection failed'));
};

const setupJsonParseError = () => {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Map([['Content-Type', 'application/json']]),
    json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
  });
};

describe('TranslateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Validación de parámetros', () => {
    it('dado que falta sourceLanguage, cuando se ejecuta translateContent, entonces lanza error de validación', async () => {
      setupAuthToken('valid-token');

      await expectErrorThrownWithMessage(
        () => translateContent('', 'en', 'Hello world'),
        'Todos los campos son obligatorios.'
      );
    });

    it('dado que falta targetLanguage, cuando se ejecuta translateContent, entonces lanza error de validación', async () => {
      setupAuthToken('valid-token');

      await expectErrorThrownWithMessage(
        () => translateContent('es', '', 'Hola mundo'),
        'Todos los campos son obligatorios.'
      );
    });

    it('dado que falta originalText, cuando se ejecuta translateContent, entonces lanza error de validación', async () => {
      setupAuthToken('valid-token');

      await expectErrorThrownWithMessage(
        () => translateContent('es', 'en', ''),
        'Todos los campos son obligatorios.'
      );
    });
  });

  describe('Casos de éxito con respuesta JSON', () => {
    it('dado que parámetros son válidos, cuando se ejecuta translateContent, entonces llama al endpoint correcto', async () => {
      setupAuthToken('valid-token');
      setupJsonResponse('Hello world');

      await translateContent('es', 'en', 'Hola mundo');

      expectCorrectTranslationUrl();
    });

    it('dado que usuario tiene token, cuando se ejecuta translateContent, entonces incluye token en headers', async () => {
      setupAuthToken('valid-token');
      setupJsonResponse('Hello world');

      await translateContent('es', 'en', 'Hola mundo');

      expectAuthTokenUsed('valid-token');
    });

    it('dado que parámetros son válidos, cuando se ejecuta translateContent, entonces genera body correcto', async () => {
      setupAuthToken('valid-token');
      setupJsonResponse('Hello world');

      await translateContent('es', 'en', 'Hola mundo');

      expectTranslationRequestBody('es', 'en', 'Hola mundo');
    });

    it('dado que backend responde con JSON válido, cuando se ejecuta translateContent, entonces retorna texto traducido', async () => {
      setupAuthToken('valid-token');
      setupJsonResponse('Hello world');

      const result = await translateContent('es', 'en', 'Hola mundo');

      expectSuccessfulTranslation(result, 'Hello world');
    });

    it('dado que respuesta JSON no tiene translatedText, cuando se ejecuta translateContent, entonces usa mensaje por defecto', async () => {
      setupAuthToken('valid-token');
      setupJsonResponseWithoutTranslatedText({ message: 'Success', data: {} });

      const result = await translateContent('es', 'en', 'Hola mundo');

      expectSuccessfulTranslation(result, 'No se pudo obtener la traducción');
    });

    it('dado que usuario no tiene token, cuando se ejecuta translateContent, entonces procede sin autenticación', async () => {
      setupAuthToken('');
      setupJsonResponse('Hello world');

      await translateContent('es', 'en', 'Hola mundo');

      expectNoAuthTokenUsed();
    });
  });

  describe('Casos de éxito con respuesta de texto', () => {
    it('dado que backend responde con texto plano, cuando se ejecuta translateContent, entonces retorna contenido directamente', async () => {
      setupAuthToken('valid-token');
      setupTextResponse('Translated text content');

      const result = await translateContent('es', 'en', 'Texto original');

      expectSuccessfulTranslation(result, 'Translated text content');
    });

    it('dado que respuesta es texto plano, cuando se procesa respuesta, entonces registra en console', async () => {
      setupAuthToken('valid-token');
      setupTextResponse('Plain text response');

      await translateContent('es', 'en', 'Texto');

      expectConsoleLogCalled('Respuesta del backend (Texto):');
    });
  });

  describe('Manejo de errores HTTP específicos', () => {
    it('dado que backend responde 403, cuando se ejecuta translateContent, entonces lanza error de permisos', async () => {
      setupAuthToken('valid-token');
      setupForbiddenResponse();

      await expectErrorThrownWithMessage(
        () => translateContent('es', 'en', 'Texto'),
        'No tienes permiso para realizar esta acción.'
      );
    });

    it('dado que backend responde 500, cuando se ejecuta translateContent, entonces lanza error de servidor', async () => {
      setupAuthToken('valid-token');
      setupServerErrorResponse();

      await expectErrorThrownWithMessage(
        () => translateContent('es', 'en', 'Texto'),
        'Error interno del servidor. Inténtalo más tarde.'
      );
    });

    it('dado que backend responde otro error, cuando se ejecuta translateContent, entonces usa mensaje genérico', async () => {
      setupAuthToken('valid-token');
      setupFailedResponse(400, 'Bad request data');

      await expectErrorThrownWithMessage(
        () => translateContent('es', 'en', 'Texto'),
        'Error 400: Error'
      );
    });
  });

  describe('Manejo de errores de conexión', () => {
    it('dado que hay error de red, cuando se ejecuta translateContent, entonces lanza error de conexión', async () => {
      setupAuthToken('valid-token');
      setupNetworkError();

      await expectErrorThrownWithMessage(
        () => translateContent('es', 'en', 'Texto'),
        'Network connection failed'
      );
    });

    it('dado que respuesta JSON es inválida, cuando se ejecuta translateContent, entonces lanza error genérico', async () => {
      setupAuthToken('valid-token');
      setupJsonParseError();

      await expectErrorThrownWithMessage(
        () => translateContent('es', 'en', 'Texto'),
        'Invalid JSON'
      );
    });
  });

  describe('Logging y debugging', () => {
    it('dado que se ejecuta translateContent, cuando inicia proceso, entonces registra URL generada', async () => {
      setupAuthToken('valid-token');
      setupJsonResponse('Hello world');

      await translateContent('es', 'en', 'Hola mundo');

      expectConsoleLogCalled('URL generada para la traducción:');
    });

    it('dado que se ejecuta translateContent, cuando inicia proceso, entonces registra cuerpo de solicitud', async () => {
      setupAuthToken('valid-token');
      setupJsonResponse('Hello world');

      await translateContent('es', 'en', 'Hola mundo');

      expectConsoleLogCalled('Cuerpo de la solicitud:');
    });

    it('dado que backend responde con JSON, cuando procesa respuesta, entonces registra respuesta', async () => {
      setupAuthToken('valid-token');
      setupJsonResponse('Hello world');

      await translateContent('es', 'en', 'Hola mundo');

      expectConsoleLogCalled('Respuesta del backend (JSON):');
    });

    it('dado que hay error en backend, cuando procesa error, entonces registra error en console', async () => {
      setupAuthToken('valid-token');
      setupFailedResponse(400, 'Error details');

      await expect(translateContent('es', 'en', 'Texto')).rejects.toThrow('Error 400: Error');
      expectConsoleErrorCalled('Error en la respuesta del backend:');
    });

    it('dado que hay error en solicitud, cuando maneja error, entonces registra error en console', async () => {
      setupAuthToken('valid-token');
      setupNetworkError();

      await expect(translateContent('es', 'en', 'Texto')).rejects.toThrow('Network connection failed');
      expectConsoleErrorCalled('Error al realizar la solicitud:');
    });
  });

  describe('Casos edge de Content-Type', () => {
    it('dado que respuesta no tiene Content-Type header, cuando procesa respuesta, entonces maneja como texto', async () => {
      setupAuthToken('valid-token');
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map(),
        text: vi.fn().mockResolvedValue('No content type response')
      });

      const result = await translateContent('es', 'en', 'Texto');

      expectSuccessfulTranslation(result, 'No content type response');
    });

    it('dado que Content-Type es mixto, cuando incluye json, entonces procesa como JSON', async () => {
      setupAuthToken('valid-token');
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Map([['Content-Type', 'application/json; charset=utf-8']]),
        json: vi.fn().mockResolvedValue({ translatedText: 'JSON with charset' })
      });

      const result = await translateContent('es', 'en', 'Texto');

      expectSuccessfulTranslation(result, 'JSON with charset');
    });
  });
});