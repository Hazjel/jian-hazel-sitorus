import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Trash2, MailOpen, Mail } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMessages(data);
        } catch (error) {
            toast.error("Failed to load messages");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const { error } = await supabase.from("messages").delete().eq("id", deleteTarget.id);
            if (error) throw error;
            toast.success("Message deleted");
            fetchMessages();
        } catch (error) {
            toast.error("Failed to delete message");
        } finally {
            setDeleteTarget(null);
        }
    };

    const toggleReadStatus = async (message) => {
        try {
            const { error } = await supabase
                .from("messages")
                .update({ is_read: !message.is_read })
                .eq("id", message.id);

            if (error) throw error;

            setMessages(messages.map(m =>
                m.id === message.id ? { ...m, is_read: !m.is_read } : m
            ));
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
                <p className="text-muted-foreground">
                    View inquiries from your contact form.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inbox ({messages.filter(m => !m.is_read).length} unread)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Sender</TableHead>
                                <TableHead className="w-[40%]">Message</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Loading messages...
                                    </TableCell>
                                </TableRow>
                            ) : messages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-[400px] text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
                                                <MailOpen className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p className="text-lg font-medium text-foreground">All caught up!</p>
                                            <p className="text-sm">You don't have any messages yet.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                messages.map((message) => (
                                    <TableRow key={message.id} className={!message.is_read ? "bg-muted/50" : ""}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(message.created_at), "MMM d, yyyy")}
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(message.created_at), "h:mm a")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{message.name}</div>
                                            <div className="text-sm text-muted-foreground">{message.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="line-clamp-2 text-sm">{message.message}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleReadStatus(message)}
                                                title={message.is_read ? "Mark as unread" : "Mark as read"}
                                            >
                                                {message.is_read ? (
                                                    <span className="flex items-center text-muted-foreground">
                                                        <MailOpen className="w-4 h-4 mr-2" /> Read
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-blue-500 font-medium">
                                                        <Mail className="w-4 h-4 mr-2" /> Unread
                                                    </span>
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => setDeleteTarget({ id: message.id, label: `message from ${message.name}` })}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete message?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the {deleteTarget?.label}. This action cannot be undone.
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

export default Messages;
