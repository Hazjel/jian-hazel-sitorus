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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";

export function ExperienceDialog({ experienceToEdit = null, onSuccess }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            role: "",
            organization: "",
            type: "organization",
            period_start: "",
            period_end: "",
            description: "",
            is_current: false,
            sort_order: 0,
        },
    });

    useEffect(() => {
        if (experienceToEdit) {
            form.reset({
                role: experienceToEdit.role,
                organization: experienceToEdit.organization,
                type: experienceToEdit.type,
                period_start: experienceToEdit.period_start || "",
                period_end: experienceToEdit.period_end || "",
                description: experienceToEdit.description || "",
                is_current: experienceToEdit.is_current || false,
                sort_order: experienceToEdit.sort_order || 0,
            });
        } else {
            form.reset({
                role: "",
                organization: "",
                type: "organization",
                period_start: "",
                period_end: "",
                description: "",
                is_current: false,
                sort_order: 0,
            });
        }
    }, [experienceToEdit, form, open]);

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const data = {
                role: values.role,
                organization: values.organization,
                type: values.type,
                period_start: values.period_start || null,
                period_end: values.period_end || null,
                description: values.description || null,
                is_current: values.is_current,
                sort_order: parseInt(values.sort_order) || 0,
            };

            let error;
            if (experienceToEdit) {
                ({ error } = await supabase
                    .from("experiences")
                    .update(data)
                    .eq("id", experienceToEdit.id));
            } else {
                ({ error } = await supabase.from("experiences").insert([data]));
            }

            if (error) throw error;

            toast.success(`Experience ${experienceToEdit ? "updated" : "added"} successfully!`);
            setOpen(false);
            onSuccess();
        } catch (error) {
            console.error("Error saving experience:", error);
            toast.error(error.message || "Failed to save experience.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {experienceToEdit ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{experienceToEdit ? "Edit Experience" : "Add Experience"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="role"
                            rules={{ required: "Role is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role / Position</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Frontend Developer Intern" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="organization"
                            rules={{ required: "Organization is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organization</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Telkom University, BEM, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            rules={{ required: "Type is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="internship">Internship</SelectItem>
                                            <SelectItem value="organization">Organization</SelectItem>
                                            <SelectItem value="committee">Committee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="period_start"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Period</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Aug 2023" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="period_end"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Period</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Dec 2023 (or blank)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_current"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-3">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="w-4 h-4"
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Currently active</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief description of your role..."
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sort_order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sort Order</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" placeholder="0 = top" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Experience"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
