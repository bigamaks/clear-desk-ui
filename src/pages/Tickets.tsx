import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import TicketModal from "@/components/Tickets/TicketModal";
import DeleteConfirmDialog from "@/components/Tickets/DeleteConfirmDialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

// Define interface for stored ticket data (before normalization)
interface StoredTicket {
  id: string;
  title: string;
  description: string;
  status: string; // Could be any string from localStorage
  priority: "low" | "medium" | "high";
  createdAt: string;
}

// Define interface for user session
interface UserSession {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>();
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('ticketapp_session');
    if (!session) {
      toast.error("Your session has expired — please log in again.");
      navigate("/login");
      return;
    }

    try {
      JSON.parse(session) as UserSession;
    } catch (error) {
      toast.error("Invalid session — please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  
  useEffect(() => {
    const loadTickets = () => {
      try {
        const session: UserSession | null = JSON.parse(localStorage.getItem("ticketapp_session") || "null");
        
        if (session && session.email) {
          const storedTickets = localStorage.getItem(`ticketapp_tickets_${session.email}`);
          if (storedTickets) {
            const parsedTickets: StoredTicket[] = JSON.parse(storedTickets);

            const normalizedTickets = parsedTickets.map((ticket) => ({
              ...ticket,
              status: normalizeStatus(ticket.status)
            }));
            setTickets(normalizedTickets);
          }
        }
      } catch (error) {
        console.error("Error loading tickets:", error);
        toast.error("Failed to load tickets. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    const normalizeStatus = (status: string): "open" | "in_progress" | "closed" => {
      switch (status) {
        case "in-progress":
        case "in_progress":
          return "in_progress";
        case "open":
          return "open";
        case "closed":
          return "closed";
        default:
          return "open";
      }
    };

    loadTickets();
    window.addEventListener('storage', loadTickets);
    return () => window.removeEventListener('storage', loadTickets);
  }, []);


  useEffect(() => {
    const session: UserSession | null = JSON.parse(localStorage.getItem("ticketapp_session") || "null");
    
    if (session && session.email) {
      localStorage.setItem(`ticketapp_tickets_${session.email}`, JSON.stringify(tickets));
    }
  }, [tickets]);

  const statusColors = {
    open: "bg-green-100 text-green-800 border-green-200",
    in_progress: "bg-amber-100 text-amber-800 border-amber-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-orange-100 text-orange-800 border-orange-200", 
    high: "bg-red-100 text-red-800 border-red-200",
  };

  const handleCreateTicket = () => {
    setSelectedTicket(undefined);
    setIsModalOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleSaveTicket = (ticketData: Omit<Ticket, "id" | "createdAt">) => {
    const session: UserSession | null = JSON.parse(localStorage.getItem("ticketapp_session") || "null");
    
    if (!session) {
      toast.error("Your session has expired — please log in again.");
      navigate("/login");
      return;
    }

    if (ticketData.description && ticketData.description.length > 1000) {
      toast.error("Description must be less than 1000 characters");
      return;
    }

    if (selectedTicket) {
      // Update existing ticket
      const updatedTicket = {
        ...selectedTicket,
        ...ticketData
      };
      setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)));
      toast.success("Ticket updated successfully!");
    } else {
      // Create new ticket
      const newTicket: Ticket = {
        ...ticketData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
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

  const handleLogout = () => {
    localStorage.removeItem('ticketapp_session');
    toast.success("You've logged out successfully");
    navigate('/');
  };

  const user: UserSession | null = JSON.parse(localStorage.getItem("ticketapp_session") || "null");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header isAuthenticated={!!user} onLogout={handleLogout} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" 
                 role="status" aria-label="Loading tickets">
              <span className="sr-only">Loading tickets...</span>
            </div>
            <p className="text-gray-600">Loading tickets...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAuthenticated={!!user} onLogout={handleLogout} />

      <main className="flex-1 py-8">
        <div className="max-w-1440 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Tickets</h1>
              <p className="text-gray-600">
                {tickets.length > 0 
                  ? `You have ${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}`
                  : "Create, edit, and manage your support tickets"
                }
              </p>
            </div>
            <Button 
              onClick={handleCreateTicket} 
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
              New Ticket
            </Button>
          </div>

          {tickets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white rounded-lg shadow-lg border-0 text-center p-6">
                <div className="text-3xl font-bold text-blue-600" aria-live="polite">
                  {tickets.length}
                </div>
                <div className="text-gray-600 font-medium">Total</div>
              </Card>
              <Card className="bg-white rounded-lg shadow-lg border-0 text-center p-6">
                <div className="text-3xl font-bold text-green-600" aria-live="polite">
                  {tickets.filter(t => t.status === 'open').length}
                </div>
                <div className="text-gray-600 font-medium">Open</div>
              </Card>
              <Card className="bg-white rounded-lg shadow-lg border-0 text-center p-6">
                <div className="text-3xl font-bold text-amber-600" aria-live="polite">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </div>
                <div className="text-gray-600 font-medium">In Progress</div>
              </Card>
              <Card className="bg-white rounded-lg shadow-lg border-0 text-center p-6">
                <div className="text-3xl font-bold text-gray-600" aria-live="polite">
                  {tickets.filter(t => t.status === 'closed').length}
                </div>
                <div className="text-gray-600 font-medium">Closed</div>
              </Card>
            </div>
          )}

          {/* Tickets Grid - Responsive behavior */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Ticket list">
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id} 
                className="bg-white rounded-lg shadow-lg border-0 hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500"
                role="listitem"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="text-xl text-gray-900 font-bold">
                      {ticket.title}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTicket(ticket)}
                        className="h-8 w-8 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                        aria-label={`Edit ticket: ${ticket.title}`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(ticket.id)}
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ticket: ${ticket.title}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      className={`${statusColors[ticket.status]} border font-medium`}
                      aria-label={`Status: ${ticket.status.replace('_', ' ')}`}
                    >
                      {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${priorityColors[ticket.priority]} border font-medium`}
                      aria-label={`Priority: ${ticket.priority}`}
                    >
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base mb-4">
                    {ticket.description || "No description provided"}
                  </CardDescription>
                  <div className="text-sm text-gray-500">
                    <time dateTime={ticket.createdAt}>
                      Created: {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {tickets.length === 0 && (
            <Card className="bg-white rounded-lg shadow-lg border-0 text-center py-12">
              <CardContent className="flex flex-col items-center justify-center">
                <div 
                  className="w-16 h-16 text-gray-400 mb-4 opacity-50" 
                  aria-hidden="true"
                >
                  <Plus className="w-16 h-16" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No tickets found
                </h2>
                <p className="text-gray-600 mb-2 text-center max-w-md">
                  Get started by creating your first support ticket
                </p>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  Track issues, manage priorities, and resolve problems efficiently
                </p>
                <Button 
                  onClick={handleCreateTicket} 
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Your First Ticket
                </Button>
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