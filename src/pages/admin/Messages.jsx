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
import { Trash2, MailOpen, Mail } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            const { error } = await supabase.from("messages").delete().eq("id", id);
            if (error) throw error;
            toast.success("Message deleted");
            fetchMessages();
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    const toggleReadStatus = async (message) => {
        try {
            const { error } = await supabase
                .from("messages")
                .update({ is_read: !message.is_read })
                .eq("id", message.id);

            if (error) throw error;

            // Update local state to reflect change immediately
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
                                    <TableCell colSpan={5} className="text-center py-8">
                                        No messages yet.
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
                                                onClick={() => handleDelete(message.id)}
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
        </div>
    );
};

export default Messages;
