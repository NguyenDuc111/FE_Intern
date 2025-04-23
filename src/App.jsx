import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Content/Home"
import Header from "./components/headerfooter/Header";
import Footer from "./components/headerfooter/Footer";
import About from "./components/Content/About";
import Product from "./components/Content/Product";
import Contact from "./components/Content/Contact";
import Profile from "./components/UserPage/Profile";


function App() {
  return (
    <>
      <div>
       
        {/* Cấu hình định tuyến */}
        
        <Routes>
          {/* Tự động chuyển về /login khi vào / */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About/>} />
          <Route path="/product" element={<Product/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>

       
      </div>
    </>
  );
}
// }

export default App;
