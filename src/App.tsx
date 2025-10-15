import {Routes, Route, BrowserRouter, useLocation} from "react-router-dom";
import './App.css'
import ExplorePage from "./features/Explore/ExplorePage.tsx";
import ManageWorkPage from "./features/ManageWork/ManageWorkPage.tsx";
import CreatePiece from "./features/Work/MyWorks.tsx";
import Create from "./features/Work/Create.tsx";
import Home from "./features/Home/Home.tsx";
import { LoginPage } from "./features/Login/LoginPage.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import Header from "./components/Header.tsx";
import AddChapter from "./features/Chapter/AddChapter.tsx";
import PreviewChapter from "./features/Chapter/PreviewChapter.tsx";
import { ToastProvider } from "./components/ToastProvider";
import {MilkdownProvider} from "@milkdown/react";
import Footer from "./components/Footer.tsx";


function App() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/login" element={ <>
                    <Header/>
                    <LoginPage />
                    <Footer />
                </>} />

                <Route path="/" element={<>
                    <Header/>
                    <Home />
                    <Footer />
                </>} />

                <Route path="/home" element={
                    <>
                        <Header/>
                        <Home />
                        <Footer />
                    </>
                } />

                <Route path="/explore" element={
                    <ProtectedRoute>
                        <Header />
                        <ExplorePage />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/my-works" element={
                    <ProtectedRoute>
                        <Header />
                        <CreatePiece />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/create" element={
                    <ProtectedRoute>
                        <Header />
                        <Create />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/manage-work/:id" element={
                    <ProtectedRoute>
                        <Header />
                        <ManageWorkPage />
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/chapter/work/:id/edit/:chapterId" element={
                    <ProtectedRoute>
                            <Header />
                        <MilkdownProvider>
                            <AddChapter />
                        </MilkdownProvider>
                        <Footer />
                    </ProtectedRoute>
                } />

                <Route path="/preview" element={
                    <ProtectedRoute>
                        <PreviewChapter />
                    </ProtectedRoute>
                } />
            </Routes>
        <ToastProvider /> 
    </BrowserRouter>
    )
}

export default App
