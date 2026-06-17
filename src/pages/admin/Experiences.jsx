import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExperienceDialog } from "@/components/admin/ExperienceDialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const Experiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const { data, error } = await supabase
                .from("experiences")
                .select("*")
                .order("sort_order", { ascending: true })
                .order("created_at", { ascending: false });

            if (error) throw error;
            setExperiences(data || []);
        } catch (error) {
            console.error("Error fetching experiences:", error);
            toast.error("Failed to load experiences.");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const { error } = await supabase.from("experiences").delete().eq("id", deleteTarget.id);
            if (error) throw error;
            toast.success("Experience deleted successfully");
            fetchExperiences();
        } catch (error) {
            console.error("Error deleting experience:", error);
            toast.error("Failed to delete experience.");
        } finally {
            setDeleteTarget(null);
        }
    };

    const typeLabel = (type) => {
        return { internship: "Internship", organization: "Organization", committee: "Committee" }[type] ?? type;
    };

    if (loading) {
        return <div className="p-8 text-muted-foreground">Loading experiences...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Experiences</h2>
                    <p className="text-muted-foreground">
                        Manage your internships, organizations, and committees.
                    </p>
                </div>
                <ExperienceDialog onSuccess={fetchExperiences} />
            </div>

            <div className="border rounded-md bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            <TableHead>Organization</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {experiences.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No experiences found. Add your first experience!
                                </TableCell>
                            </TableRow>
                        ) : (
                            experiences.map((exp) => (
                                <TableRow key={exp.id}>
                                    <TableCell className="font-medium">
                                        {exp.role}
                                        {exp.is_current && (
                                            <span className="ml-2 inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                                                Current
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{exp.organization}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                            {typeLabel(exp.type)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {exp.period_start || "—"}
                                        {exp.period_end ? ` – ${exp.period_end}` : exp.is_current ? " – Present" : ""}
                                    </TableCell>
                                    <TableCell>{exp.sort_order ?? 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <ExperienceDialog
                                                experienceToEdit={exp}
                                                onSuccess={fetchExperiences}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteTarget({ id: exp.id, label: `${exp.role} at ${exp.organization}` })}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete experience?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{deleteTarget?.label}</strong>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Experiences;
