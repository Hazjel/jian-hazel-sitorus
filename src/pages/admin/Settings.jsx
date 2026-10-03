import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Image, Key, Upload } from "lucide-react";

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleUpdatePhoto = async (e) => {
        e.preventDefault();

        if (!photoFile) {
            toast.error("Please choose a photo first.");
            return;
        }

        if (!photoFile.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.storage
                .from("project-images")
                .upload("profile/profile-photo", photoFile, {
                    cacheControl: "3600",
                    contentType: photoFile.type,
                    upsert: true,
                });

            if (error) throw error;

            toast.success("Profile photo updated successfully");
            setPhotoFile(null);
            e.target.reset();
        } catch (error) {
            toast.error(error.message || "Failed to update profile photo");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            toast.success("Password updated successfully");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Image className="w-5 h-5" />
                        Profile Photo
                    </CardTitle>
                    <CardDescription>
                        Upload the photo shown in the public About section.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePhoto} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="profile-photo">Photo</Label>
                            <Input
                                id="profile-photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            <Upload className="w-4 h-4 mr-2" />
                            {loading ? "Uploading..." : "Update Photo"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Change Password
                    </CardTitle>
                    <CardDescription>
                        Update your administrator password. You will use this new password next time you log in.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password (min. 6 characters)"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
