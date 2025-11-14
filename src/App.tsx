import { Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'
import ExplorePage from "./app/features/Explore/ExplorePage.tsx";
import ManageWorkPage from "./app/features/ManageWork/ManageWorkPage.tsx";
import CreatePiece from "./app/features/Work/MyWorks.tsx";
import Create from "./app/features/Work/Create.tsx";
import Home from "./app/features/Home/Home.tsx";
import StartPage from "./quiz/pages/StartPage";
import QuestionsPage from "./quiz/pages/QuestionsPage";
import CorrectPage from "./quiz/pages/CorrectPage";
import IncorrectPage from "./quiz/pages/IncorrectPage";
import { LoginPage } from "./app/features/Login/LoginPage.tsx";
import { ProtectedRoute } from "./app/components/ProtectedRoute.tsx";
import Header from "./app/components/Header.tsx";
import AddChapter from "./app/features/Chapter/AddChapter.tsx";
import PreviewChapter from "./app/features/Chapter/PreviewChapter.tsx";
import { ToastProvider } from "./app/components/ToastProvider.tsx";
import { MilkdownProvider } from "@milkdown/react";
import Footer from "./app/components/Footer.tsx";

import { WorkDetail } from './app/features/WorkDetail/WorkDetail.tsx';
import ReadChapterNovel from "./app/features/WorkDetail/ReadChapterNovel.tsx";
import Notifications from "./app/features/Notifications/Notifications.tsx";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ShellWithoutFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <Shell>
            <LoginPage />
          </Shell>
        } />

        <Route path="/" element={
          <Shell>
            <Home />
          </Shell>
        } />

        <Route path="/home" element={
          <Shell>
            <Home />
          </Shell>
        } />

        <Route path="/explore" element={
          <ProtectedRoute>
            <Shell>
              <ExplorePage />
            </Shell>
          </ProtectedRoute>
        } />

        <Route path="/my-works" element={
          <ProtectedRoute>
            <Shell>
              <CreatePiece />
            </Shell>
          </ProtectedRoute>
        } />

        <Route path="/create" element={
          <ProtectedRoute>
            <Shell>
              <Create />
            </Shell>
          </ProtectedRoute>
        } />

        <Route path="/manage-work/:id" element={
          <ProtectedRoute>
            <Shell>
              <ManageWorkPage />
            </Shell>
          </ProtectedRoute>
        } />

        <Route path="/chapter/work/:id/edit/:chapterId" element={
          <ProtectedRoute>
            <Shell>
              <MilkdownProvider>
                <AddChapter />
              </MilkdownProvider>
            </Shell>
          </ProtectedRoute>
        } />

        <Route path="/preview" element={
          <ProtectedRoute>
            <PreviewChapter />
          </ProtectedRoute>
        } />

        {/* Rutas del quiz (inicio, preguntas, correct/incorrect) */}
        <Route path="/quiz" element={<>
          <Header />
          <StartPage />
          <Footer />
        </>} />

        <Route path="/quiz/questions" element={<>
          <Header />
          <QuestionsPage />
          <Footer />
        </>} />

        <Route path="/quiz/correct" element={<>
          <Header />
          <CorrectPage />
          <Footer />
        </>} />

        <Route path="/quiz/incorrect" element={<>
          <Header />
          <IncorrectPage />
          <Footer />
        </>} />

        <Route path="/work/chapter/:chapterId/read" element={
          <ProtectedRoute>
            <ShellWithoutFooter>
              <ReadChapterNovel />
            </ShellWithoutFooter>
          </ProtectedRoute>
        } />

        <Route path="/work/:workId" element={
          <ProtectedRoute>
            <Shell>
              <WorkDetail />
            </Shell>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <Shell>
            <Notifications />
          </Shell>
        } />
      </Routes>
      <ToastProvider />
    </BrowserRouter>
  )
}

export default App