import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Ticket, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TicketData {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

interface UserSession {
  email: string;
  name?: string;
}

const Dashboard = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to normalize status values
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
        return "open"; // Default to open if invalid status
    }
  };

  // Load tickets from localStorage
  useEffect(() => {
    const loadTickets = () => {
      try {
        const sessionRaw = localStorage.getItem("ticketapp_session");
        const session: UserSession | null = sessionRaw ? JSON.parse(sessionRaw) : null;
        
        if (session && session.email) {
          const storedTickets = localStorage.getItem(`ticketapp_tickets_${session.email}`);
          if (storedTickets) {
            const parsedTickets: TicketData[] = JSON.parse(storedTickets);
            // Properly normalize status to ensure "in_progress" format
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

    loadTickets();
    window.addEventListener('storage', loadTickets);
    return () => window.removeEventListener('storage', loadTickets);
  }, []);

  // Authentication and session check
  useEffect(() => {
    const sessionRaw = localStorage.getItem('ticketapp_session');
    if (!sessionRaw) {
      toast.error("Your session has expired — please log in again.");
      navigate("/auth/login");
      return;
    }

    // Check if session is valid JSON
    try {
      JSON.parse(sessionRaw) as UserSession;
    } catch (error) {
      toast.error("Invalid session — please log in again.");
      navigate("/auth/login");
    }
  }, [navigate]);

  // Calculate stats - Using proper "in_progress" status
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
  const inProgressTickets = tickets.filter(ticket => ticket.status === 'in_progress').length;
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;

  const sessionRaw = localStorage.getItem("ticketapp_session") || '{}';
  const user: UserSession = JSON.parse(sessionRaw);

  function handleLogout() {
    localStorage.removeItem('ticketapp_session');
    toast.success("You've logged out successfully");
    navigate('/');
  }

  // Recent tickets (last 5)
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Status color configuration matching requirements - "in_progress" with amber
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'in_progress': // Using underscore
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
      case 'closed':
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header isAuthenticated={!!user} onLogout={handleLogout} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" 
              role="status" 
              aria-label="Loading dashboard"
            >
              <span className="sr-only">Loading dashboard...</span>
            </div>
            <p className="text-gray-600">Loading dashboard...</p>
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
        {/* Consistent max-width container - 1440px as required */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome, {user?.name || 'User'} 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your tickets and track progress easily.
            </p>
          </div>

          {/* Statistics Cards - Consistent card design with shadows and rounded corners */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Tickets */}
            <Card className="bg-white rounded-lg shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2" aria-live="polite">
                  {totalTickets}
                </div>
                <div className="text-gray-600 font-medium">Total Tickets</div>
              </CardContent>
            </Card>

            {/* Open Tickets */}
            <Card className="bg-white rounded-lg shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2" aria-live="polite">
                  {openTickets}
                </div>
                <div className="text-gray-600 font-medium">Open Tickets</div>
              </CardContent>
            </Card>

            {/* In Progress Tickets - Using "in_progress" status */}
            <Card className="bg-white rounded-lg shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2" aria-live="polite">
                  {inProgressTickets}
                </div>
                <div className="text-gray-600 font-medium">In Progress</div>
              </CardContent>
            </Card>

            {/* Closed Tickets */}
            <Card className="bg-white rounded-lg shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2" aria-live="polite">
                  {closedTickets}
                </div>
                <div className="text-gray-600 font-medium">Resolved Tickets</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tickets Section */}
          {recentTickets.length > 0 && (
            <Card className="bg-white rounded-lg shadow-lg border-0 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Recent Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" role="list" aria-label="Recent tickets">
                  {recentTickets.map((ticket) => {
                    const statusColors = getStatusColor(ticket.status);
                    return (
                      <div 
                        key={ticket.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-blue-500"
                        role="listitem"
                        tabIndex={0}
                      >
                        <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {ticket.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {ticket.description?.substring(0, 80) || 'No description provided'}
                            {ticket.description && ticket.description.length > 80 && '...'}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span 
                              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}
                              aria-label={`Status: ${ticket.status.replace('_', ' ')}`}
                            >
                              {/* Properly display "in progress" with space */}
                              {ticket.status === 'in_progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                            <span 
                              className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                              aria-label={`Priority: ${ticket.priority}`}
                            >
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:ml-4">
                          <time 
                            className="text-sm text-gray-500 whitespace-nowrap" 
                            dateTime={ticket.createdAt}
                          >
                            {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {tickets.length > 5 && (
                  <div className="text-center mt-6">
                    <Link to="/tickets">
                      <Button 
                        variant="outline" 
                        className="text-blue-600 hover:text-blue-500 font-medium border-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View All Tickets →
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-white rounded-lg shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/tickets" className="flex-1 max-w-xs">
                  <Button 
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium text-center focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    size="lg"
                  >
                    Manage Tickets
                  </Button>
                </Link>
                <Link to="/tickets" className="flex-1 max-w-xs">
                  <Button 
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium text-center focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                    Create New Ticket
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  className="flex-1 max-w-xs bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium text-center focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  size="lg"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {tickets.length === 0 && (
            <Card className="bg-white rounded-lg shadow-lg border-0 text-center py-12">
              <CardContent>
                <div 
                  className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" 
                  aria-hidden="true"
                >
                  <Ticket className="w-16 h-16" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No tickets yet
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Get started by creating your first support ticket. Track issues, manage priorities, and resolve problems efficiently.
                </p>
                <Link to="/tickets">
                  <Button 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                    Create Your First Ticket
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;