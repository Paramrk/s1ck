import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Immediate instant reset of all potential scrolling elements
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const main = document.querySelector("main");
        if (main) {
            main.scrollTop = 0;
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
