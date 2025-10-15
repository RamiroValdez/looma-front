<<<<<<< Updated upstream
import {Routes, Route, BrowserRouter } from "react-router-dom";
=======
import {Routes, Route, BrowserRouter} from "react-router-dom";
>>>>>>> Stashed changes
import './App.css'
import ExplorePage from "./features/Explore/ExplorePage.tsx";
import ManageWorkPage from "./features/ManageWork/ManageWorkPage.tsx";
import CreatePiece from "./features/Work/MyWorks.tsx";
import Create from "./features/Work/Create.tsx";
import Home from "./features/Home/Home.tsx";
import {LoginPage} from "./features/Login/LoginPage.tsx";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";
import Header from "./components/Header.tsx";
import AddChapter from "./features/Chapter/AddChapter.tsx";
import { ToastProvider } from "./components/ToastProvider"; 
import {MilkdownProvider} from "@milkdown/react";


function App() {

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                <Route path="/" element={<Home />} />

                <Route path="/home" element={<Home />} />

                <Route path="/explore" element={
                    <ProtectedRoute>
                        <ExplorePage />
                    </ProtectedRoute>
                } />

                <Route path="/my-works" element={
                    <ProtectedRoute>
                        <CreatePiece />
                    </ProtectedRoute>
                } />

                <Route path="/create" element={
                    <ProtectedRoute>
                        <Create />
                    </ProtectedRoute>
                } />

                <Route path="/manage-work/:id" element={
                    <ProtectedRoute>
                        <ManageWorkPage />
                    </ProtectedRoute>
                } />

                 <Route path="/chapter/work/:id/edit/:chapterId" element={
                    <ProtectedRoute>
                        <MilkdownProvider>
                            <AddChapter />
                        </MilkdownProvider>
                    </ProtectedRoute>
                } />

            </Routes>
        <ToastProvider /> 

    </BrowserRouter>
    )
}

export default App
