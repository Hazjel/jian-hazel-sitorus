import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SkillDialog } from "@/components/admin/SkillDialog";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const { data, error } = await supabase
                .from("skills")
                .select("*")
                .order("category", { ascending: true })
                .order("name", { ascending: true });

            if (error) throw error;
            setSkills(data || []);
        } catch (error) {
            console.error("Error fetching skills:", error);
            toast.error("Failed to load skills.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this skill?")) {
            return;
        }

        try {
            const { error } = await supabase.from("skills").delete().eq("id", id);
            if (error) throw error;

            toast.success("Skill deleted successfully");
            fetchSkills();
        } catch (error) {
            console.error("Error deleting skill:", error);
            toast.error("Failed to delete skill.");
        }
    };

    if (loading) {
        return <div className="p-8 text-muted-foreground">Loading skills...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
                    <p className="text-muted-foreground">
                        Manage your technical skills and proficiencies.
                    </p>
                </div>
                <SkillDialog onSuccess={fetchSkills} />
            </div>

            <div className="border rounded-md bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Skill Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Proficiency (%)</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {skills.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No skills found. Add your first skill!
                                </TableCell>
                            </TableRow>
                        ) : (
                            skills.map((skill) => (
                                <TableRow key={skill.id}>
                                    <TableCell className="font-medium">
                                        {skill.name}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                                            {skill.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {skill.proficiency > 0 ? `${skill.proficiency}%` : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <SkillDialog
                                                skillToEdit={skill}
                                                onSuccess={fetchSkills}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(skill.id)}
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
        </div>
    );
};

export default Skills;
