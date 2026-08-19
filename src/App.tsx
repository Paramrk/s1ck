import { Routes, Route, Navigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import MenShopPage from "./pages/MenShopPage";
import WomenShopPage from "./pages/WomenShopPage";
import OurStoryPage from "./pages/OurStoryPage";
import VipClubPage from "./pages/VipClubPage";
import AffiliatePage from "./pages/AffiliatePage";
import WholesalerPage from "./pages/WholesalerPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactUsPage from "./pages/ContactUsPage";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
    return (
        <>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/men" element={<MenShopPage />} />
            <Route path="/shop/women" element={<WomenShopPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/vip-club" element={<VipClubPage />} />
            <Route path="/unlock-vip" element={<Navigate to="/vip-club" replace />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            <Route path="/wholesaler" element={<WholesalerPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
            <Route path="/product/:handle" element={<ProductDetailPage />} />
            <Route path="/products/:handle" element={<ProductDetailPage />} />
        </Routes>
        </>
    );
};
export default App;
