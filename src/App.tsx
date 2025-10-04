import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'
import ExplorePage from "./features/Explore/ExplorePage.tsx";
import ManageWorkPage from "./features/ManageWork/ManageWorkPage.tsx";
import CreatePiece from "./features/Work/MyWorks.tsx";
import Create from "./features/Work/Create.tsx";
import Home from "./features/Home/Home.tsx";
import {LoginPage} from "./features/Login/LoginPage.tsx";
import {ProtectedRoute} from "./components/ProtectedRoute.tsx";



function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                <Route path="/" element={<Home />} />

                <Route path="/home" element={<Home />} />

                <Route path="/Explore" element={
                    <ProtectedRoute>
                        <ExplorePage />
                    </ProtectedRoute>
                } />

                <Route path="/MyWorks" element={
                    <ProtectedRoute>
                        <CreatePiece />
                    </ProtectedRoute>
                } />

                <Route path="/Create" element={
                    <ProtectedRoute>
                        <Create />
                    </ProtectedRoute>
                } />

                <Route path="/ManageWork/:id?" element={
                    <ProtectedRoute>
                        <ManageWorkPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App
