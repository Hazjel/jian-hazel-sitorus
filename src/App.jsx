import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import Messages from "./pages/admin/Messages";
import Skills from "./pages/admin/Skills";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTracker from "./components/PageTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker />
          <Routes>
            <Route path="/" element={<Index />} />
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
              {/* Future admin routes will go here */}
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
