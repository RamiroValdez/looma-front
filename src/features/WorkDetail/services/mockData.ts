// mockData.ts (puedes crear este archivo temporalmente en tu directorio de servicios o features)

import {type WorkDTO } from '../../../dto/WorkDTO'; 

export const MOCK_WORK_DATA: WorkDTO = {
  id: 1,
  title: "La Torre de los Sueños Olvidados",
  description: "Una sinopsis emocionante sobre un viajero que debe escalar la Torre de babel antes que el tiempo se acabe...",
  cover: "/assets/covers/mock_cover.jpg",
  banner: "/img/portadas/banner1.jpg",
  state: 'InProgress',
  createdAt: '2024-01-10T10:00:00Z',
  updatedAt: '2025-09-15T15:30:00Z',
  publicationDate: '2025-01-15T00:00:00Z',
  format: { id: 1, name: "Novela Ligera" },
  originalLanguage: { id: 1, name: "Español" },
  price: 5.99,
  likes: 15200,
  creator: { id: 5, name: "Autor Fantasma", surname: "Fantasma", username: "autor_fantasma", email: "autor@example.com" },
  categories: [{ id: 1, name: "Fantasía" }, { id: 2, name: "Aventura" }],
  tags: [{ id: 10, name: "Magia" }, { id: 11, name: "Post-Apocalíptico" }],
  chapters: [
    { id: 101, title: "El Despertar", description: "Había una vez", price: 0, likes: 2500, lastModified: '2025-01-15', publishedAt: '2025-01-15', publicationStatus: "PUBLISHED" },
    { id: 102, title: "La Primera Prueba", description: "Hace unos años", price: 0, likes: 1800, lastModified: '2025-01-22', publishedAt: '2025-01-22', publicationStatus: "PUBLISHED" },
    { id: 103, title: "El Contrato Sellado", description: "Un amanecer", price: 2.50, likes: 100, lastModified: '2025-02-01', publishedAt: '2025-02-01', publicationStatus: "PUBLISHED" },
    { id: 104, title: "El Capítulo Inédito", description: "En 1800", price: 0, likes: 200, lastModified: '2025-02-10', publishedAt: '2025-02-10', publicationStatus: "DRAFT" },
    { id: 105, title: "El Ascenso Final", description: "Hace mil años", price: 3.00, likes: 50, lastModified: '2025-02-20', publishedAt: '2025-02-20', publicationStatus: "DRAFT" },
    
  ],
};