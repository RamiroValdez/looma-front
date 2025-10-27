import { useAuthStore } from "../../domain/store/AuthStore";

export async function uploadCover(workId: number, coverFile: File | null, coverIaUrl: string | null): Promise<{ fetchStatus: number }> {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No auth token available");

  const formData = new FormData();
  if (coverFile !== null){
      formData.append("cover", coverFile);
  }
  if (coverIaUrl !== null && coverIaUrl !== undefined) {
      formData.append("coverIaUrl", coverIaUrl);
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_MY_WORKS_URL}/${workId}/cover`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Error ${response.status}: ${text || response.statusText}`);
  }
  return { fetchStatus: response.status };
}

export async function uploadBanner(workId: number, bannerFile: File, coverFile?: File): Promise<{ fetchStatus: number }> {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("No auth token available");

  const formData = new FormData();
  formData.append("banner", bannerFile);
  if (coverFile) formData.append("cover", coverFile);

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_MY_WORKS_URL}/${workId}/banner`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Error ${response.status}: ${text || response.statusText}`);
  }
  return { fetchStatus: response.status };
}
