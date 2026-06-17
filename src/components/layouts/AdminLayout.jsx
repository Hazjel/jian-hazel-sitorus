import { useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard, FolderKanban, MessageSquare, Settings,
    LogOut, Code, Briefcase, Menu, X,
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
    { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
    { icon: Code, label: "Skills", path: "/admin/skills" },
    { icon: Briefcase, label: "Experiences", path: "/admin/experiences" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const NavLinks = ({ onNavigate }) => (
        <>
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={onNavigate}
                        aria-current={isActive(item.path) ? "page" : undefined}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
                            isActive(item.path)
                                ? "bg-primary text-primary-foreground"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                    variant="ghost"
                    aria-label="Logout from admin panel"
                    className="w-full flex items-center justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    Logout
                </Button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Hazel Admin
                    </h1>
                </div>
                <NavLinks onNavigate={undefined} />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}
            <aside
                className={`fixed top-0 left-0 h-full w-64 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 md:hidden ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-label="Admin navigation"
            >
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Hazel Admin
                    </h1>
                    <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close navigation"
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <NavLinks onNavigate={() => setMobileOpen(false)} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto min-w-0">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                    <button
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open navigation"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-admin-nav"
                        className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                        {menuItems.find((m) => isActive(m.path))?.label ?? "Admin"}
                    </span>
                </div>

                <div className="p-6 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
