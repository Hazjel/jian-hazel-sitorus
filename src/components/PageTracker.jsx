import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PageTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Filter tracking:
        // 1. Ignore Admin pages
        // 2. Ignore Login page
        if (location.pathname.startsWith("/admin") || location.pathname === "/login") {
            return;
        }

        // Prevent double counting (React Strict Mode) and reloading spam
        const trackedPaths = JSON.parse(sessionStorage.getItem("trackedViews") || "[]");

        if (trackedPaths.includes(location.pathname)) {
            return; // Already tracked this path in the current session
        }

        const trackView = async () => {
            try {
                // Record locally immediately to prevent race conditions in Strict Mode
                trackedPaths.push(location.pathname);
                sessionStorage.setItem("trackedViews", JSON.stringify(trackedPaths));

                await supabase.from("site_views").insert([
                    { page_path: location.pathname }
                ]);

                console.log("View recorded:", location.pathname);
            } catch (error) {
                // Silently fail is fine for analytics
                console.error("Error tracking view:", error);
            }
        };

        trackView();
    }, [location.pathname]);

    return null;
};

export default PageTracker;
