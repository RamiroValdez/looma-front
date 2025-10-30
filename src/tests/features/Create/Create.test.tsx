/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Create from '../../../features/Work/Create';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Evitar navegación real
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// IMPORTANTE: los specifiers deben coincidir con Create.tsx (con .ts)
vi.mock('../../../services/categoryService.ts', () => ({
  useCategories: () => ({
    categories: [{ id: 1, name: 'Fantasía' }, { id: 2, name: 'Ciencia Ficción' }],
    isLoading: false,
    error: null,
  }),
}));
vi.mock('../../../services/formatService.ts', () => ({
  useFormats: () => ({
    formats: [{ id: 1, name: 'Novela' }, { id: 2, name: 'Cuento' }],
    isLoading: false,
    error: null,
  }),
}));
vi.mock('../../../services/languageService.ts', () => ({
  useLanguages: () => ({
    languages: [{ id: 1, name: 'Español' }, { id: 2, name: 'Inglés' }],
    isLoading: false,
    error: null,
  }),
}));

// Sugerencias (usa react-query debajo): mock para evitar QueryClient en este hook
vi.mock('../../../services/TagSuggestionService.ts', () => ({
  useSuggestTagsMutation: () => ({ mutate: vi.fn(), isLoading: false }),
}));

// Mock de notificaciones para no ejecutar efectos reales
vi.mock('../../../services/ToastProviderService.ts', () => ({
  notifySuccess: vi.fn(),
}));

// Espiar envío de creación
const mutateAsyncMock = vi.fn().mockResolvedValue(123);
vi.mock('../../../services/CreateWorkService.ts', () => ({
  useCreateWork: () => ({ mutateAsync: mutateAsyncMock, isLoading: false }),

  createFormDataForWork: (dto: any, banner?: File | null, cover?: File | null) => {
    const fd = new FormData();
    fd.append('work', JSON.stringify(dto)); // <-- string en vez de Blob
    if (banner) fd.append('banner', banner);
    if (cover) fd.append('cover', cover);
    return fd;
  },
  // Evita mutaciones reales (si la vista lo usa)
  useGenerateCover: () => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({ url: 'https://cdn.test/cover.png' }),
    isLoading: false,
    reset: vi.fn(),
  }),

  // Hooks/funciones que Create importa y usa
  useClickOutside: () => {},
  validateFile: vi.fn(async () => ({ valid: true, previewUrl: 'blob://test' })),
  handleAddTag: (
    formattedText: string,
    currentTags: string[],
    setCurrentTags: (tags: string[]) => void,
    setIsAddingTag: (b: boolean) => void,
    setNewTagText: (s: string) => void,
    setIsSuggestionMenuOpen: (b: boolean) => void
  ) => {
    if (!currentTags.includes(formattedText)) setCurrentTags([...currentTags, formattedText]);
    setIsAddingTag(false);
    setNewTagText('');
    setIsSuggestionMenuOpen(false);
  },
}));

describe('Create - envía correctamente los datos del formulario', () => {
  beforeEach(() => {
    mutateAsyncMock.mockClear();
    mockNavigate.mockClear();
    // Polyfills JSDOM
    // @ts-ignore
    if (!global.URL.createObjectURL) global.URL.createObjectURL = vi.fn(() => 'blob://test');
    // @ts-ignore
    if (!global.URL.revokeObjectURL) global.URL.revokeObjectURL = vi.fn();
  });

  it('completa mínimos, sube archivos y envía', async () => {
    const user = userEvent.setup();
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <Create />
        </QueryClientProvider>
      </MemoryRouter>
    );

    // Título y descripción
    await user.type(screen.getByTestId('work-title'), 'Mi Obra');
    await user.type(screen.getByTestId('work-description'), 'Descripción suficientemente larga para validar.');

    // Formato e idioma
    await user.selectOptions(screen.getByTestId('format-select'), '1');
    await user.selectOptions(screen.getByTestId('language-select'), '1');

    // Categoría: localizar la fila por el label y dentro hacer click al botón "+"
    const categoriasLabel = screen.getByText('Categorías');
    const categoriasRow = categoriasLabel.parentElement as HTMLElement; // div.flex.items-start
    const categoriasContainer = categoriasRow.querySelector('div') as HTMLElement; // primer div contenedor a la derecha del label
    await user.click(within(categoriasContainer).getByRole('button', { name: '+' }));
    await user.click(screen.getByText('Fantasía'));

    // Etiquetas: localizar la fila por el label y click en el "+" de tags
    const etiquetasLabel = screen.getByText('Etiquetas');
    const etiquetasRow = etiquetasLabel.parentElement as HTMLElement;
    const etiquetasContainer = etiquetasRow.querySelector('div') as HTMLElement;
    await user.click(within(etiquetasContainer).getByRole('button', { name: '+' }));
    await user.type(screen.getByTestId('tag-input'), 'aventura');
    await user.keyboard('{Enter}');

    // Archivos
    const bannerFile = new File(['banner-bytes'], 'banner.png', { type: 'image/png' });
    const coverFile = new File(['cover-bytes'], 'cover.jpg', { type: 'image/jpeg' });
    await user.upload(screen.getByTestId('banner-input') as HTMLInputElement, bannerFile);
    await user.upload(screen.getByTestId('cover-input') as HTMLInputElement, coverFile);

    // Enviar
    await user.click(screen.getByTestId('submit-create'));

    // Llamada al servicio
    expect(mutateAsyncMock).toHaveBeenCalledTimes(1);

    // Payload: FormData con work/banner/cover
  const fd = mutateAsyncMock.mock.calls[0][0] as FormData;

  // Lee 'work' tolerando string o Blob
  const workPart = fd.get('work') as unknown;
  let work: any;
  if (typeof workPart === 'string') {
    work = JSON.parse(workPart);
  } else if (workPart && typeof (workPart as Blob).text === 'function') {
    work = JSON.parse(await (workPart as Blob).text());
  } else {
    // Fallback robusto por si alguna lib devuelve otro tipo
    work = JSON.parse(await new Response(workPart as any).text());
  }

  expect(work).toMatchObject({
    title: 'Mi Obra',
    description: expect.any(String),
    formatId: 1,
    originalLanguageId: 1,
    categoryIds: expect.arrayContaining([1]),
    tagIds: expect.arrayContaining(['aventura']),
  });

  expect((fd.get('banner') as File)?.name).toBe('banner.png');
  expect((fd.get('cover') as File)?.name).toBe('cover.jpg');

  expect(mockNavigate).toHaveBeenCalledWith('/manage-work/123');
});

});