import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'
import HomePage from "./features/Home/HomePage.tsx";
import ExplorePage from "./features/Explore/ExplorePage.tsx";
import CreatePiece from "./features/Piece/CreateWork.tsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Explore" element={<ExplorePage />} />
                <Route path="/MyWorks" element={<CreatePiece />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
