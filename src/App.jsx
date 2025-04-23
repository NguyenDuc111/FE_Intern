import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Content/Home"
import About from "./components/Content/About";
import Product from "./components/Content/Product";
import Contact from "./components/Content/Contact";
import Profile from "./components/UserPage/Profile";
import ProductPage from "./components/Pages/ProductPage";


function App() {
  return (
    <>
      <div>
       
        {/* Cấu hình định tuyến */}
        
        <Routes>
          {/* Tự động chuyển về /login khi vào / */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About/>} />
          <Route path="/product" element={<Product/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/products" element={<ProductPage/>} />
        </Routes>

       
      </div>
    </>
  );
}
// }

export default App;
