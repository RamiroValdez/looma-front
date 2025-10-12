import type { WorkDTO } from "../dto/WorkDTO";
import type { CreateWorkDTO } from "./CreateWorkService";
import { createFormDataForWork } from "./CreateWorkService";
import { useAuthStore } from "../store/AuthStore";

function mapWorkToCreateWorkDTO(work: WorkDTO, tagNames?: string[]): CreateWorkDTO {
  return {
    title: work.title,
    description: work.description ?? "",
    formatId: work.format?.id,
    originalLanguageId: work.originalLanguage?.id,
    categoryIds: work.categories?.map((c) => c.id) ?? [],
    tagIds: tagNames && tagNames.length > 0 ? tagNames : (work.tags?.map((t) => t.name) ?? []),
  };
}

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
