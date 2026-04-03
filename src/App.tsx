import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Breeds from "./pages/Breeds/Breeds";
import Care from "./pages/Care/Care";
import Feeding from "./pages/Feeding/Feeding";
import FloorCare from "./pages/FloorCare/FloorCare";
import Diseases from "./pages/Diseases/Diseases";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breeds" element={<Breeds />} />
        <Route path="/care" element={<Care />} />
        <Route path="/feeding" element={<Feeding />} />
        <Route path="/floor-care" element={<FloorCare />} />
        <Route path="/diseases" element={<Diseases />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
