import { Routes, Route, BrowserRouter } from "react-router-dom";
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
function App() {

    return (
        <BrowserRouter>

            <Routes>
                <Route path="/login" element={ <><Header/><LoginPage /></>} />

                <Route path="/" element={<><Header/><Home /></>} />

                <Route path="/home" element={<><Header/><Home /></>} />

                <Route path="/explore" element={
                    <ProtectedRoute>
                        <Header />
                        <ExplorePage />
                    </ProtectedRoute>
                } />

                <Route path="/my-works" element={
                    <ProtectedRoute>
                        <Header />
                        <CreatePiece />
                    </ProtectedRoute>
                } />

                <Route path="/create" element={
                    <ProtectedRoute>
                        <Header />
                        <Create />
                    </ProtectedRoute>
                } />

                <Route path="/manage-work/:id" element={
                    <ProtectedRoute>
                        <Header />
                        <ManageWorkPage />
                    </ProtectedRoute>
                } />

                <Route path="/chapter/work/:id/edit/:chapterId" element={
                    <ProtectedRoute>
                        <Header />
                        <AddChapter />
                    </ProtectedRoute>
                } />

                <Route path="/preview" element={
                    <ProtectedRoute>
                        <PreviewChapter />
                    </ProtectedRoute>
                } />

            </Routes>
        </BrowserRouter>
    )
}

export default App
