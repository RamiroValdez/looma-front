import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'
import HomePage from "./features/Home/HomePage.tsx";
import ExplorePage from "./features/Explore/ExplorePage.tsx";
import CreatePiece from "./features/Work/CreateWork.tsx";
import Create from "./features/Work/Create.tsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Explore" element={<ExplorePage />} />
              <Route path="/MyWorks" element={<CreatePiece />} />
              <Route path="/Create" element={<Create /> } />

          </Routes>
      </BrowserRouter>
  )
}

export default App
