import { Routes, Route } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import MenShopPage from "./pages/MenShopPage";
import WomenShopPage from "./pages/WomenShopPage";
import OurStoryPage from "./pages/OurStoryPage";
import VipClubPage from "./pages/VipClubPage";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/men" element={<MenShopPage />} />
            <Route path="/shop/women" element={<WomenShopPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/vip-club" element={<VipClubPage />} />
        </Routes>
    );
};

export default App;
