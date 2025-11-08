import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Create from '../../../app/features/Work/Create';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../infrastructure/services/CategoryService.ts', () => ({
  useCategories: () => ({
    categories: [{ id: 1, name: 'Fantasía' }, { id: 2, name: 'Ciencia Ficción' }],
    isLoading: false,
    error: null,
  }),
}));
vi.mock('../../../infrastructure/services/FormatService.ts', () => ({
  useFormats: () => ({
    formats: [{ id: 1, name: 'Novela' }, { id: 2, name: 'Cuento' }],
    isLoading: false,
    error: null,
  }),
}));
vi.mock('../../../infrastructure/services/LanguageService.ts', () => ({
  useLanguages: () => ({
    languages: [{ id: 1, name: 'Español' }, { id: 2, name: 'Inglés' }],
    isLoading: false,
    error: null,
  }),
}));

vi.mock('../../../infrastructure/services/TagSuggestionService.ts', () => ({
  useSuggestTagsMutation: () => ({ mutate: vi.fn(), isLoading: false }),
}));

vi.mock('../../../infrastructure/services/ToastProviderService.ts', () => ({
  notifySuccess: vi.fn(),
}));

const mutateAsyncMock = vi.fn().mockResolvedValue(123);
vi.mock('../../../infrastructure/services/CreateWorkService.ts', () => ({
  useCreateWork: () => ({ mutateAsync: mutateAsyncMock, isLoading: false }),

  createFormDataForWork: (dto: any, banner?: File | null, cover?: File | null) => {
    const fd = new FormData();
    fd.append('work', JSON.stringify(dto)); 
    if (banner) fd.append('banner', banner);
    if (cover) fd.append('cover', cover);
    return fd;
  },

  useGenerateCover: () => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({ url: 'https://cdn.test/cover.png' }),
    isLoading: false,
    reset: vi.fn(),
  }),

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
    // @ts-expect-error
    if (!global.URL.createObjectURL) global.URL.createObjectURL = vi.fn(() => 'blob://test');
    // @ts-expect-error
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

    await user.type(screen.getByTestId('work-title'), 'Mi Obra');
    await user.type(screen.getByTestId('work-description'), 'Descripción suficientemente larga para validar.');

    await user.selectOptions(screen.getByTestId('format-select'), '1');
    await user.selectOptions(screen.getByTestId('language-select'), '1');

    const categoriasLabel = screen.getByText('Categorías');
    const categoriasRow = categoriasLabel.parentElement as HTMLElement; 
    const categoriasContainer = categoriasRow.querySelector('div') as HTMLElement;
    await user.click(within(categoriasContainer).getByRole('button', { name: '+' }));
    await user.click(screen.getByText('Fantasía'));

    const etiquetasLabel = screen.getByText('Etiquetas');
    const etiquetasRow = etiquetasLabel.parentElement as HTMLElement;
    const etiquetasContainer = etiquetasRow.querySelector('div') as HTMLElement;
    await user.click(within(etiquetasContainer).getByRole('button', { name: '+' }));
    await user.type(screen.getByTestId('tag-input'), 'aventura');
    await user.keyboard('{Enter}');

    const bannerFile = new File(['banner-bytes'], 'banner.png', { type: 'image/png' });
    const coverFile = new File(['cover-bytes'], 'cover.jpg', { type: 'image/jpeg' });
    await user.upload(screen.getByTestId('banner-input') as HTMLInputElement, bannerFile);
    await user.upload(screen.getByTestId('cover-input') as HTMLInputElement, coverFile);

    await user.click(screen.getByTestId('submit-create'));

    expect(mutateAsyncMock).toHaveBeenCalledTimes(1);

  const fd = mutateAsyncMock.mock.calls[0][0] as FormData;

  const workPart = fd.get('work') as unknown;
  let work: any;
  if (typeof workPart === 'string') {
    work = JSON.parse(workPart);
  } else if (workPart && typeof (workPart as Blob).text === 'function') {
    work = JSON.parse(await (workPart as Blob).text());
  } else {
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