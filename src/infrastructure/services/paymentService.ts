import { useAuthStore } from "../store/AuthStore.ts";
import { handleError } from "../errorHandler.ts";
import { v4 as uuidv4 } from "uuid";
import type { SubscribeRequestDTO } from "../../domain/dto/SubscribeRequestDTO.ts";

export interface PaymentRedirectResponse {
    redirectUrl?: string;
    url?: string;
    redirect_url?: string;
    init_point?: string;
    sandbox_init_point?: string;
    preference_url?: string;
    checkout_url?: string;
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
      returnUrl: `${import.meta.env.VITE_MP_RETURN_URL}${uuidv4()}`,
    };

    const base = import.meta.env.VITE_API_BASE_URL || "";
    const paymentsBase = (import.meta.env as { VITE_API_PAYMENTS_URL?: string }).VITE_API_PAYMENTS_URL || "/payments";
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

    const data = (await response.json().catch(() => ({}))) as PaymentRedirectResponse;
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
      returnUrl: `${import.meta.env.VITE_MP_RETURN_URL}${uuidv4()}`,
    };

    const base = import.meta.env.VITE_API_BASE_URL || "";
      const paymentsBase = (import.meta.env as { VITE_API_PAYMENTS_URL?: string }).VITE_API_PAYMENTS_URL || "/payments";
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

    const data = (await response.json().catch(() => ({}))) as PaymentRedirectResponse;
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
    const paymentUUID = uuidv4();
    const body: SubscribeRequestDTO & { returnUrl: string } = {
      subscriptionType: "chapter",
      targetId: chapterId,
      workId,
      provider,
      returnUrl: `${import.meta.env.VITE_MP_RETURN_URL}${paymentUUID}`,
    };

    const base = import.meta.env.VITE_API_BASE_URL || "";
    const paymentsBase = (import.meta.env as { VITE_API_PAYMENTS_URL?: string }).VITE_API_PAYMENTS_URL || "/payments";
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

      const data = (await response.json().catch(() => ({}))) as PaymentRedirectResponse;
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
