import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subscribeToWork, subscribeToAuthor, subscribeToChapter } from '../../infrastructure/services/paymentService';
import { useAuthStore } from '../../infrastructure/store/AuthStore';

vi.mock('../../infrastructure/store/AuthStore', () => ({
  useAuthStore: {
    getState: vi.fn()
  }
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234')
}));

vi.mock('../../infrastructure/errorHandler', () => ({
  handleError: vi.fn((error) => error.message || 'Unknown error')
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: '',
    VITE_API_PAYMENTS_URL: '/payments',
    VITE_MP_RETURN_URL: 'https://app.test.com/payment-return/'
  },
  configurable: true
});


const expectSuccessfulResponse = (result: any, expectedStatus: number, expectedUrl: string) => {
  expect(result.fetchStatus).toBe(expectedStatus);
  expect(result.redirectUrl).toBe(expectedUrl);
};

const expectErrorThrown = async (serviceCall: () => Promise<any>, expectedMessage: string) => {
  await expect(serviceCall).rejects.toThrow(expectedMessage);
};

const expectAuthTokenUsed = (token: string) => {
  expect(useAuthStore.getState).toHaveBeenCalled();
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  expect(lastCall[1].headers.Authorization).toBe(`Bearer ${token}`);
};

const expectCorrectPaymentUrl = (expectedUrl: string) => {
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  expect(lastCall[0]).toBe(expectedUrl);
};

const expectRequestBodyContains = (expectedFields: Record<string, any>) => {
  const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
  const body = JSON.parse(lastCall[1].body);
  
  Object.entries(expectedFields).forEach(([key, value]) => {
    expect(body[key]).toBe(value);
  });
};

const setupAuthToken = (token: string) => {
  vi.mocked(useAuthStore.getState).mockReturnValue({
    token,
    isAuthenticated: !!token,
    setToken: vi.fn(),
    logout: vi.fn()
  });
};

const setupSuccessfulResponse = (redirectUrl: string) => {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({ redirectUrl })
  });
};

const setupFailedResponse = (status: number, message: string) => {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    statusText: 'Bad Request',
    json: vi.fn().mockResolvedValue({ message })
  });
};

const setupNetworkError = () => {
  mockFetch.mockRejectedValue(new Error('Network error'));
};

const setupResponseWithMultipleFields = (responseData: Record<string, string>) => {
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue(responseData)
  });
};

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribeToWork', () => {
    describe('Casos de éxito', () => {
      it('dado que usuario tiene token válido, cuando se suscribe a obra, entonces llama al endpoint correcto', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToWork(123, 'mercadopago');

        expectCorrectPaymentUrl('/payments/subscribe');
      });

      it('dado que usuario tiene token válido, cuando se suscribe a obra, entonces incluye token en headers', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToWork(123, 'mercadopago');

        expectAuthTokenUsed('valid-token');
      });

      it('dado que usuario tiene token válido, cuando se suscribe a obra, entonces genera body correcto', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToWork(123, 'mercadopago');

        expectRequestBodyContains({
          subscriptionType: 'work',
          targetId: 123,
          provider: 'mercadopago'
        });
      });

      it('dado que usuario tiene token válido, cuando se suscribe a obra, entonces genera returnUrl con UUID', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToWork(123, 'mercadopago');

        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const body = JSON.parse(lastCall[1].body);
        expect(body.returnUrl).toContain('mock-uuid-1234');
      });

      it('dado que backend responde exitosamente, cuando se suscribe a obra, entonces retorna respuesta correcta', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        const result = await subscribeToWork(123, 'mercadopago');

        expectSuccessfulResponse(result, 200, 'https://mercadopago.com/checkout');
      });
    });

    describe('Manejo de URLs de respuesta', () => {
      it('dado que respuesta tiene redirectUrl, cuando se procesa respuesta, entonces usa redirectUrl', async () => {
        setupAuthToken('valid-token');
        setupResponseWithMultipleFields({
          redirectUrl: 'https://mp.com/redirect',
          url: 'https://mp.com/url',
          init_point: 'https://mp.com/init'
        });

        const result = await subscribeToWork(123, 'mercadopago');

        expectSuccessfulResponse(result, 200, 'https://mp.com/redirect');
      });

      it('dado que respuesta no tiene redirectUrl pero tiene url, cuando se procesa respuesta, entonces usa url', async () => {
        setupAuthToken('valid-token');
        setupResponseWithMultipleFields({
          url: 'https://mp.com/url',
          init_point: 'https://mp.com/init'
        });

        const result = await subscribeToWork(123, 'mercadopago');

        expectSuccessfulResponse(result, 200, 'https://mp.com/url');
      });

      it('dado que respuesta solo tiene init_point, cuando se procesa respuesta, entonces usa init_point', async () => {
        setupAuthToken('valid-token');
        setupResponseWithMultipleFields({
          init_point: 'https://mp.com/init',
          sandbox_init_point: 'https://mp.com/sandbox'
        });

        const result = await subscribeToWork(123, 'mercadopago');

        expectSuccessfulResponse(result, 200, 'https://mp.com/init');
      });

      it('dado que respuesta solo tiene sandbox_init_point, cuando se procesa respuesta, entonces usa sandbox_init_point', async () => {
        setupAuthToken('valid-token');
        setupResponseWithMultipleFields({
          sandbox_init_point: 'https://mp.com/sandbox'
        });

        const result = await subscribeToWork(123, 'mercadopago');

        expectSuccessfulResponse(result, 200, 'https://mp.com/sandbox');
      });
    });

    describe('Manejo de errores', () => {
      it('dado que backend responde con error 400, cuando se suscribe a obra, entonces lanza error con mensaje específico', async () => {
        setupAuthToken('valid-token');
        setupFailedResponse(400, 'Invalid payment data');

        await expectErrorThrown(
          () => subscribeToWork(123, 'mercadopago'),
          'Invalid payment data'
        );
      });

      it('dado que hay error de red, cuando se suscribe a obra, entonces lanza error de red', async () => {
        setupAuthToken('valid-token');
        setupNetworkError();

        await expectErrorThrown(
          () => subscribeToWork(123, 'mercadopago'),
          'Network error'
        );
      });

      it('dado que usuario no tiene token, cuando se suscribe a obra, entonces procede sin token', async () => {
        setupAuthToken('');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToWork(123, 'mercadopago');

        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        expect(lastCall[1].headers.Authorization).toBeUndefined();
      });
    });
  });

  describe('subscribeToAuthor', () => {
    describe('Casos de éxito', () => {
      it('dado que usuario tiene token válido, cuando se suscribe a autor, entonces genera body correcto', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToAuthor(456, 'mercadopago');

        expectRequestBodyContains({
          subscriptionType: 'author',
          targetId: 456,
          provider: 'mercadopago'
        });
      });

      it('dado que backend responde exitosamente, cuando se suscribe a autor, entonces retorna respuesta correcta', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        const result = await subscribeToAuthor(456, 'mercadopago');

        expectSuccessfulResponse(result, 200, 'https://mercadopago.com/checkout');
      });
    });
  });

  describe('subscribeToChapter', () => {
    describe('Casos de éxito', () => {
      it('dado que usuario tiene token válido, cuando se suscribe a capítulo, entonces genera body correcto', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToChapter(789, 123, 'mercadopago');

        expectRequestBodyContains({
          subscriptionType: 'chapter',
          targetId: 789,
          workId: 123,
          provider: 'mercadopago'
        });
      });

      it('dado que backend responde exitosamente, cuando se suscribe a capítulo, entonces retorna respuesta correcta', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        const result = await subscribeToChapter(789, 123, 'mercadopago');

        expectSuccessfulResponse(result, 200, 'https://mercadopago.com/checkout');
      });

      it('dado que se suscribe a capítulo, cuando se genera returnUrl, entonces incluye UUID único', async () => {
        setupAuthToken('valid-token');
        setupSuccessfulResponse('https://mercadopago.com/checkout');

        await subscribeToChapter(789, 123, 'mercadopago');

        const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
        const body = JSON.parse(lastCall[1].body);
        expect(body.returnUrl).toContain('mock-uuid-1234');
      });
    });
  });
});