import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'
import ExplorePage from "./features/Explore/ExplorePage.tsx";
import ManageWorkPage from "./features/ManageWork/ManageWorkPage.tsx";
import CreatePiece from "./features/Work/MyWorks.tsx";
import Create from "./features/Work/Create.tsx";
import Home from "./features/Home/Home.tsx";



function App() {

  return (
      <BrowserRouter>
          <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/Explore" element={<ExplorePage />} />
              <Route path="/MyWorks" element={<CreatePiece />} />
              <Route path="/Create" element={<Create /> } />
              <Route path="/ManageWork/:id?" element={<ManageWorkPage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
