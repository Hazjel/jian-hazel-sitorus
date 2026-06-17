import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Eye, MessageSquare, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
    const [stats, setStats] = useState([
        {
            title: "Total Projects",
            value: "...",
            icon: FolderKanban,
            description: "Loading...",
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Total Views",
            value: "...",
            icon: Eye,
            description: "Loading...",
            color: "text-green-500",
            bg: "bg-green-100 dark:bg-green-900/20",
        },
        {
            title: "Unread Messages",
            value: "...",
            icon: MessageSquare,
            description: "Loading...",
            color: "text-yellow-500",
            bg: "bg-yellow-100 dark:bg-yellow-900/20",
        },
        {
            title: "Engagement Rate",
            value: "-",
            icon: TrendingUp,
            description: "No analytics data yet",
            color: "text-purple-500",
            bg: "bg-purple-100 dark:bg-purple-900/20",
        },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get Projects Count
                const { count: projectCount, error: projectError } = await supabase
                    .from("projects")
                    .select("*", { count: "exact", head: true });

                if (projectError) throw projectError;

                // Get Unread Messages Count
                const { count: messageCount, error: messageError } = await supabase
                    .from("messages")
                    .select("*", { count: "exact", head: true })
                    .eq("is_read", false);

                if (messageError) throw messageError;

                // Get Total Views Count
                const { count: viewCount, error: viewError } = await supabase
                    .from("site_views")
                    .select("*", { count: "exact", head: true });

                if (viewError) throw viewError;

                setStats((prevStats) => [
                    {
                        ...prevStats[0],
                        value: projectCount.toString(),
                        description: "Active portfolios",
                    },
                    {
                        ...prevStats[1],
                        value: viewCount.toString(),
                        description: "Total visits",
                    },
                    {
                        ...prevStats[2],
                        value: messageCount.toString(),
                        description: messageCount > 0 ? "Action required" : "All caught up",
                    },
                    prevStats[3], // Engagement (Static for now)
                ]);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back to your portfolio overview.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-40 flex items-center justify-center border-t border-muted">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <FolderKanban className="w-4 h-4" />
                            Your pipeline is clean. Manage projects from the sidebar.
                        </p>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="h-40 flex items-center justify-center border-t border-muted">
                        <div className="flex flex-col gap-3 max-w-sm w-full">
                            <Link to="/admin/projects" className="text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-center hover:bg-secondary/80 transition-colors">Manage Projects</Link>
                            <Link to="/admin/skills" className="text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-center hover:bg-secondary/80 transition-colors">Update Tech Stack</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
