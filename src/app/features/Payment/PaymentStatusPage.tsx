import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../infrastructure/store/AuthStore.ts";
import Button from "../../components/Button.tsx";
import { Loader } from "../../components/Loader.tsx";

export type PaymentSessionResponse = Record<string, any>;

const PURPLE_BG_CLASS = "bg-[#5C17A6]";
const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

function formatCurrency(amount?: number, currency?: string) {
  if (typeof amount !== "number" || isNaN(amount)) return "-";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: (currency || "ARS").toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency ?? "ARS"}`;
  }
}

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function niceProvider(v?: string) {
  const s = String(v || "").toLowerCase();
  if (s === "mercadopago" || s === "mercado_pago" || s === "mercado pago") return "Mercado Pago";
  return s ? s[0].toUpperCase() + s.slice(1) : "-";
}

function nicePaymentMethod(v?: string) {
  const s = String(v || "").toLowerCase();
  const map: Record<string, string> = {
    account_money: "Dinero en cuenta",
    credit_card: "Tarjeta de crédito",
    debit_card: "Tarjeta de débito",
    bank_transfer: "Transferencia bancaria",
    cash: "Efectivo",
    ticket: "Cupón",
  };
  return map[s] || (s ? s.replace(/_/g, " ") : "-");
}

function niceSubscriptionType(v?: string) {
  const s = String(v || "").toUpperCase();
  if (s === "WORK") return "Obra";
  if (s === "CHAPTER") return "Capítulo";
  if (s === "AUTHOR") return "Suscripción";
  return s || "-";
}

function StatusBadge({ status }: { status?: string }) {
  const normalized = (status || "").toLowerCase();
  const color = normalized.includes("approved") || normalized === "success" ?
    "bg-emerald-100 text-emerald-800 border-emerald-200" :
    normalized.includes("pending") ?
    "bg-amber-100 text-amber-800 border-amber-200" :
    normalized.includes("rejected") || normalized.includes("failed") ?
    "bg-rose-100 text-rose-800 border-rose-200" :
    "bg-slate-100 text-slate-700 border-slate-200";
  const label =
    normalized === "approved" ? "APROBADO" :
    normalized === "pending" ? "PENDIENTE" :
    normalized === "rejected" ? "RECHAZADO" :
    (normalized === "failed" || normalized === "failure") ? "FALLIDO" :
    (status ? status.toUpperCase() : "-");
  return <span className={`px-2 py-1 text-xs font-semibold rounded border ${color}`}>{label}</span>;
}

export default function PaymentStatusPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();

  const finalUuid = useMemo(() => {
    try {
      const path = window.location?.pathname || "";
      const matchFromPath = path.match(UUID_REGEX)?.[0];
      if (matchFromPath) return matchFromPath;
      const matchFromParam = (uuid || "").match(UUID_REGEX)?.[0];
      return matchFromParam || null;
    } catch {
      return (uuid || null) as string | null;
    }
  }, [uuid]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaymentSessionResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        if (!finalUuid) {
          throw new Error("No se encontró un UUID válido en la URL");
        }
        const base = (import.meta as any).env?.VITE_API_BASE_URL || "";
        const paymentsBase = ((import.meta as any).env as { VITE_API_PAYMENTS_URL?: string })?.VITE_API_PAYMENTS_URL || "/payments";
        const url = `${base}${paymentsBase}/session/${finalUuid}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || `Error ${res.status}: ${res.statusText}`);
        }
        const json = (await res.json().catch(() => ({}))) as PaymentSessionResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error inesperado");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (finalUuid) run();
    return () => { cancelled = true; };
  }, [finalUuid, token]);

  const normalizedStatus = useMemo(() => String(
    data?.status ?? data?.payment_status ?? data?.status_detail ?? ""
  ).toLowerCase(), [data]);

  const isApproved = normalizedStatus.includes("approved") || normalizedStatus === "success";

  const amount = useMemo(() => {
    const possible = [
      data?.amount,
      data?.total,
      data?.transaction_amount,
      data?.money?.amount,
      data?.payment_data?.amount,
    ].find((v) => typeof v === "number");
    return typeof possible === "number" ? possible : undefined;
  }, [data]);

  const currency = (data?.currency || data?.currency_id || data?.money?.currency || "ARS") as string;

  const id = (data?.id ?? data?.paymentId ?? data?.collection_id ?? data?.preference_id ?? data?.external_reference) as string | number | undefined;
  const title = (data?.title as string) || (data?.description as string) || "-";
  const provider = niceProvider(data?.provider as string);
  const method = nicePaymentMethod((data?.paymentMethod || data?.payment_method) as string);
  const subsType = niceSubscriptionType(data?.subscriptionType as string);
  const createdAt = formatDateTime((data?.createdAt || data?.date_created) as string);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {loading && (
        
              <div className="min-h-screen flex items-center justify-center bg-[#f4f0f7]">
                <Loader size="md" color="primary" />
              </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-800">
          <h2 className="text-lg font-semibold">No pudimos obtener el estado del pago</h2>
          <p className="mt-1 text-sm">{error}</p>
          <div className="mt-4">
            <Link to="/" className="text-sm font-medium text-rose-800 underline">Volver al inicio</Link>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-xl ring-1 ring-purple-50">
            <div className="flex flex-col items-center text-center">
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isApproved ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                {isApproved ? (
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                )}
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {isApproved ? "¡Pago aprobado con éxito!" : "Estado del pago"}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {isApproved ? "Tu transacción se ha procesado correctamente" : "Revisá el estado de tu transacción"}
              </p>
              <div className="mt-3"><StatusBadge status={(data?.status ?? data?.payment_status ?? data?.status_detail) as string} /></div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-full bg-purple-50 px-4 py-3 text-sm">
                <div className="text-slate-600">Concepto</div>
                <div className="font-medium text-slate-900">{title}</div>
              </div>
              <div className="flex items-center justify-between rounded-full bg-purple-50 px-4 py-3 text-sm">
                <div className="text-slate-600 [color:#4b1387]">Monto</div>
                <div className="font-extrabold [color:#4b1387]">{formatCurrency(amount, currency)}</div>
              </div>
              <div className="flex items-center justify-between rounded-full bg-purple-50 px-4 py-3 text-sm">
                <div className="text-slate-600">ID de transacción</div>
                <div className="font-semibold text-slate-900">{id ?? "-"}</div>
              </div>
              <div className="flex items-center justify-between rounded-full bg-purple-50 px-4 py-3 text-sm">
                <div className="text-slate-600">Proveedor</div>
                <div className="font-medium text-slate-900">{provider}</div>
              </div>
              <div className="flex items-center justify-between rounded-full bg-purple-50 px-4 py-3 text-sm">
                <div className="text-slate-600">Método de pago</div>
                <div className="font-medium text-slate-900">{method}</div>
              </div>
              <div className="flex items-center justify-between rounded-full bg-purple-50 px-4 py-3 text-sm">
                <div className="text-slate-600">Tipo de suscripción</div>
                <div className="font-medium text-slate-900">{subsType}</div>
              </div>
              <div className="flex items-center justify-between rounded-full bg-purple-50 px-4 py-3 text-sm">
                <div className="text-slate-600">Fecha y hora</div>
                <div className="font-medium text-slate-900">{createdAt}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow ring-1 ring-purple-50">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {isApproved && String(data?.subscriptionType).toUpperCase() === "CHAPTER" && typeof data?.targetId === "number" && (
                <Button
                  text="Ir al capítulo"
                  onClick={() => navigate(`/work/chapter/${data?.targetId}/read`)}
                  colorClass={`${PURPLE_BG_CLASS} w-full text-white rounded-xl cursor-pointer hover:scale-103 py-3 font-semibold`}
                  className="rounded-none px-6 py-3 text-sm"
                />
              )}
              {isApproved && String(data?.subscriptionType).toUpperCase() === "WORK" && typeof data?.targetId === "number" && (
                <Button
                  text="Ir a la obra"
                  onClick={() => navigate(`/work/${data?.targetId}`)}
                  colorClass={`${PURPLE_BG_CLASS} w-full text-white rounded-xl cursor-pointer hover:scale-103 py-3 font-semibold`}
                  className="rounded-none px-6 py-3 text-sm"
                />
              )}
              <Button
                text="Volver al inicio"
                onClick={() => navigate("/")}
                colorClass={`bg-gray-200 w-full text-gray-700 rounded-xl cursor-pointer hover:scale-103 py-3 font-semibold`}
                className="rounded-none px-6 py-3 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}