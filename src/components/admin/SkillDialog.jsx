import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";

export function SkillDialog({ skillToEdit = null, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            name: "",
            category: "Frontend",
            proficiency: 0,
        },
    });

    useEffect(() => {
        if (skillToEdit) {
            form.reset({
                name: skillToEdit.name,
                category: skillToEdit.category,
                proficiency: skillToEdit.proficiency || 0,
            });
        }
    }, [skillToEdit, form]);

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const skillData = {
                name: values.name,
                category: values.category,
                proficiency: parseInt(values.proficiency),
            };

            let error;
            if (skillToEdit) {
                const { error: updateError } = await supabase
                    .from("skills")
                    .update(skillData)
                    .eq("id", skillToEdit.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from("skills")
                    .insert([skillData]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(`Skill successfully ${skillToEdit ? "updated" : "added"}!`);
            setOpen(false);
            form.reset();
            onSuccess();
        } catch (error) {
            console.error("Error saving skill:", error);
            toast.error(error.message || "Failed to save skill.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {skillToEdit ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Skill
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{skillToEdit ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: "Skill name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Skill Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. React, Python, Figma" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Frontend">Frontend</SelectItem>
                                            <SelectItem value="Backend">Backend</SelectItem>
                                            <SelectItem value="Tools">Tools</SelectItem>
                                            <SelectItem value="Database">Database</SelectItem>
                                            <SelectItem value="Design">Design</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="proficiency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proficiency (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="e.g. 85"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Skill"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
