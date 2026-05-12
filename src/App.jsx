import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
import Work from "./pages/Work";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import Messages from "./pages/admin/Messages";
import Skills from "./pages/admin/Skills";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTracker from "./components/PageTracker";

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

// Lenis smooth scroll integration component
const SmoothScroll = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const isPortfolioPage =
      location.pathname === "/" ||
      location.pathname === "/work" ||
      location.pathname.startsWith("/project/");

    if (!isPortfolioPage) return;

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [location.pathname]);

  return children;
};

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/work" element={<Work />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="messages" element={<Messages />} />
          <Route path="skills" element={<Skills />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker />
          <SmoothScroll>
            <AnimatedRoutes />
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
