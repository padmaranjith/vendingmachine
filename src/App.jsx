import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
// import Inventory from "./components/Inventory";
import { Purchase } from "./components/Purchase";
import Layout, { Footer } from "./components/Layout";
import TabNav from "./components/TabNav";

function App() {
  return (
    <BrowserRouter>
      <Layout />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/manageInventory" element={<TabNav />} />
        {/* <Route path="/inventory" element={<Inventory />} /> */}
        <Route path="/purchase" element={<Purchase />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
