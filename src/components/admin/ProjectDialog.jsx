import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { Loader2, Plus, Image as ImageIcon } from "lucide-react";

const ProjectDialog = ({ projectToEdit, onOpenChange, onSuccess }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const form = useForm({
        defaultValues: {
            title: "",
            description: "",
            demo_link: "",
            repo_link: "",
            image_url: "",
            tags: "",
        },
    });

    useEffect(() => {
        if (projectToEdit) {
            form.reset({
                title: projectToEdit.title,
                description: projectToEdit.description || "",
                demo_link: projectToEdit.demo_link || "",
                repo_link: projectToEdit.repo_link || "",
                image_url: projectToEdit.image_url || "",
                tags: projectToEdit.tags ? projectToEdit.tags.join(", ") : "",
            });
            setOpen(true);
        } else {
            form.reset({
                title: "",
                description: "",
                demo_link: "",
                repo_link: "",
                image_url: "",
                tags: "",
            });
        }
    }, [projectToEdit, form]);

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
        if (!newOpen) {
            form.reset();
            setImageFile(null);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            let imageUrl = values.image_url;

            if (imageFile) {
                const fileExt = imageFile.name.split(".").pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from("project-images")
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from("project-images")
                    .getPublicUrl(filePath);

                imageUrl = data.publicUrl;
            }

            // Generate slug from title
            const slug = values.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");

            const projectData = {
                title: values.title,
                description: values.description,
                demo_link: values.demo_link,
                repo_link: values.repo_link,
                image_url: imageUrl,
                tags: values.tags ? values.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [],
                slug: slug,
            };

            let error;
            if (projectToEdit) {
                const { error: updateError } = await supabase
                    .from("projects")
                    .update(projectData)
                    .eq("id", projectToEdit.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from("projects")
                    .insert([projectData]);
                error = insertError;
            }

            if (error) throw error;

            toast.success(
                projectToEdit ? "Project updated successfully" : "Project created successfully"
            );
            handleOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error(error.message || "Failed to save project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {projectToEdit ? "Edit Project" : "Add New Project"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Title" {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Project Description"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags (comma separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="React, Tailwind, Node.js" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Project Image</FormLabel>
                            <FormControl>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {/* Preview functionality could be added here */}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="demo_link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Demo Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="repo_link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Repository Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://github.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {projectToEdit ? "Update Project" : "Create Project"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDialog;
