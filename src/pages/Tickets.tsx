import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import TicketModal from "@/components/Tickets/TicketModal";
import DeleteConfirmDialog from "@/components/Tickets/DeleteConfirmDialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority?: "low" | "medium" | "high";
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      title: "Fix login issue",
      description: "Users cannot log in with their credentials",
      status: "open",
      priority: "high",
    },
    {
      id: "2",
      title: "Update documentation",
      description: "API documentation needs to be updated",
      status: "in-progress",
      priority: "medium",
    },
    {
      id: "3",
      title: "Improve dashboard performance",
      description: "Dashboard loads slowly with large datasets",
      status: "closed",
      priority: "low",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>();
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const statusColors = {
    open: "bg-success text-success-foreground",
    "in-progress": "bg-warning text-warning-foreground",
    closed: "bg-muted text-muted-foreground",
  };

  const handleCreateTicket = () => {
    setSelectedTicket(undefined);
    setIsModalOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleSaveTicket = (ticket: Ticket) => {
    if (selectedTicket) {
      // Update existing ticket
      setTickets(tickets.map((t) => (t.id === ticket.id ? ticket : t)));
      toast.success("Ticket updated successfully!");
    } else {
      // Create new ticket
      const newTicket = { ...ticket, id: Date.now().toString() };
      setTickets([...tickets, newTicket]);
      toast.success("Ticket created successfully!");
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setTicketToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ticketToDelete) {
      setTickets(tickets.filter((t) => t.id !== ticketToDelete));
      toast.success("Ticket deleted successfully!");
      setIsDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated onLogout={() => {}} />

      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Tickets</h1>
              <p className="text-muted-foreground">Create, edit, and manage your support tickets</p>
            </div>
            <Button onClick={handleCreateTicket} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              New Ticket
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{ticket.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTicket(ticket)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(ticket.id)}
                        className="h-8 w-8 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status.replace("-", " ")}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {ticket.description}
                  </CardDescription>
                  {ticket.priority && (
                    <div className="mt-3">
                      <span className="text-sm text-muted-foreground">Priority: </span>
                      <span className="text-sm font-medium capitalize">{ticket.priority}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {tickets.length === 0 && (
            <Card className="shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No tickets found</p>
                <Button onClick={handleCreateTicket}>Create Your First Ticket</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTicket}
        ticket={selectedTicket}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Tickets;
