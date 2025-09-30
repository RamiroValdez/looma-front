import {Routes, Route, BrowserRouter } from "react-router-dom";
import './App.css'
import HomePage from "./features/Home/HomePage.tsx";
import ExplorePage from "./features/Explore/ExplorePage.tsx";
import Header from "./components/Header/Header.tsx";

function App() {

  return (
      <BrowserRouter>
      <Header />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Explore" element={<ExplorePage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
