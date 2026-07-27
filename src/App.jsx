import { lazy, Suspense, useEffect } from "react";
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
import CustomCursor from "./components/CustomCursor";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTracker from "./components/PageTracker";
import { Analytics } from "@vercel/analytics/react";

// Eager — critical path
import Index from "./pages/Index";

// Lazy — split by route
const Work = lazy(() => import("./pages/Work"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const AdminLayout = lazy(() => import("./components/layouts/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Projects = lazy(() => import("./pages/admin/Projects"));
const Messages = lazy(() => import("./pages/admin/Messages"));
const Skills = lazy(() => import("./pages/admin/Skills"));
const Experiences = lazy(() => import("./pages/admin/Experiences"));
const Settings = lazy(() => import("./pages/admin/Settings"));

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

// Cursor only on portfolio pages
const CursorWrapper = () => {
  const location = useLocation();
  const isPortfolioPage =
    location.pathname === "/" ||
    location.pathname === "/work" ||
    location.pathname.startsWith("/project/");

  if (!isPortfolioPage) return null;
  return <CustomCursor />;
};

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <CursorWrapper />
      <PageTransition key={location.pathname}>
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
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
              <Route path="experiences" element={<Experiences />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </>
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
        <Analytics />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
