import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Breeds from "./pages/Breeds/Breeds";
import Breeding from "./pages/Breeding/Breeding";
import Care from "./pages/Care/Care";
import Feeding from "./pages/Feeding/Feeding";
import FloorCare from "./pages/FloorCare/FloorCare";
import Diseases from "./pages/Diseases/Diseases";
import Okril from "./pages/Okril/Okril";
import Parasites from "./pages/Parasites/Parasites";
import FirstAid from "./pages/FirstAid/FirstAid";
import Tips from "./pages/Tips/Tips";
import Calculator from "./pages/Calculator/Calculator";
import Vaccinations from "./pages/Vaccinations/Vaccinations";
import Enclosure from "./pages/Enclosure/Enclosure";
import Calendar from "./pages/Calendar/Calendar";
import Slaughter from "./pages/Slaughter/Slaughter";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breeds" element={<Breeds />} />
        <Route path="/breeding" element={<Breeding />} />
        <Route path="/care" element={<Care />} />
        <Route path="/feeding" element={<Feeding />} />
        <Route path="/floor-care" element={<FloorCare />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/okril" element={<Okril />} />
        <Route path="/parasites" element={<Parasites />} />
        <Route path="/first-aid" element={<FirstAid />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/vaccinations" element={<Vaccinations />} />
        <Route path="/enclosure" element={<Enclosure />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/slaughter" element={<Slaughter />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
