import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Header = ({ isAuthenticated = false, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-1440 mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          <Ticket className="h-6 w-6 text-primary" aria-hidden="true" />
          <span>Clear Desk</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                Dashboard
              </Link>
              <Link 
                to="/tickets" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                Tickets
              </Link>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;