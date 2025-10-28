/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "../store/AuthStore.ts";
import { handleError } from "../utils/errorHandler.ts";

export interface SubscribeRequestDTO {
  subscriptionType: "chapter";
  targetId: number; // chapter ID
  workId: number;
  provider: "mercadopago";
}

export async function subscribeToWork(
  workId: number,
  provider: "mercadopago" = "mercadopago"
): Promise<{ fetchStatus: number; redirectUrl?: string }> {
  try {
    const token = useAuthStore.getState().token;
    const body = {
      subscriptionType: "work" as const,
      targetId: workId,
      provider,
      returnUrl: `https://www.youtube.com/watch?v=v1uJyYf6KR8`, // agregar URL de looma
    };

    const base = import.meta.env.VITE_API_BASE_URL || "";
    const paymentsBase = (import.meta.env as any).VITE_API_PAYMENTS_URL || "/payments";
    const response = await fetch(`${base}${paymentsBase}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json().catch(() => ({}))) as any;
    const redirectUrl: string | undefined =
      data?.redirectUrl ??
      data?.url ??
      data?.redirect_url ??
      data?.init_point ??
      data?.sandbox_init_point ??
      data?.preference_url ??
      data?.checkout_url;
    return { fetchStatus: response.status, redirectUrl };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function subscribeToAuthor(
  authorId: number,
  provider: "mercadopago" = "mercadopago"
): Promise<{ fetchStatus: number; redirectUrl?: string }> {
  try {
    const token = useAuthStore.getState().token;
    const body = {
      subscriptionType: "author" as const,
      targetId: authorId,
      provider,
      returnUrl: `https://www.youtube.com/watch?v=v1uJyYf6KR8`,  // agregar URL de looma
    };

    const base = import.meta.env.VITE_API_BASE_URL || "";
    const paymentsBase = (import.meta.env as any).VITE_API_PAYMENTS_URL || "/payments";
    const response = await fetch(`${base}${paymentsBase}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json().catch(() => ({}))) as any;
    const redirectUrl: string | undefined =
      data?.redirectUrl ??
      data?.url ??
      data?.redirect_url ??
      data?.init_point ??
      data?.sandbox_init_point ??
      data?.preference_url ??
      data?.checkout_url;
    return { fetchStatus: response.status, redirectUrl };
  } catch (error) {
    throw new Error(handleError(error));
  }
}

export async function subscribeToChapter(
  chapterId: number,
  workId: number,
  provider: "mercadopago" = "mercadopago"
): Promise<{ fetchStatus: number; redirectUrl?: string }> {
  try {
    const token = useAuthStore.getState().token;
    const body: SubscribeRequestDTO & { returnUrl: string } = {
      subscriptionType: "chapter",
      targetId: chapterId,
      workId,
      provider,
        // agregar URL de looma, la idea es tomar el paymentId que venga de MP para redirigir al usuario a la pantalla de confirmación
        // de pago, haciendo una pegada al backend trayendo los datos de ese paymentId y verificando que el pago haya sido exitoso
      returnUrl: `https://looma-front-production.up.railway.app/`,
    };

    const base = import.meta.env.VITE_API_BASE_URL || "";
    const paymentsBase = (import.meta.env as any).VITE_API_PAYMENTS_URL || "/payments";
    const response = await fetch(
      `${base}${paymentsBase}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json().catch(() => ({}))) as any;
    const redirectUrl: string | undefined =
      data?.redirectUrl ??
      data?.url ??
      data?.redirect_url ??
      data?.init_point ??
      data?.sandbox_init_point ??
      data?.preference_url ??
      data?.checkout_url;
    return { fetchStatus: response.status, redirectUrl };
  } catch (error) {
    throw new Error(handleError(error));
  }
}
