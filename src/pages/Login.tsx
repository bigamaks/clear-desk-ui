import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import WaveBackground from "@/components/Decorative/WaveBackground";
import DecorativeCircle from "@/components/Decorative/DecorativeCircle";
import { Ticket } from "lucide-react";

// Define interfaces for type safety
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface FormErrors {
  email: string;
  password: string;
  general: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<FormErrors>({ 
    email: "", 
    password: "",
    general: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { 
      email: "", 
      password: "",
      general: "" 
    };
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormErrors, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get existing users from localStorage
      const existingUsers: User[] = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");
      
      // Find user by email (case-insensitive) - FIXED: Removed :any
      const foundUser = existingUsers.find((user: User) => 
        user.email.toLowerCase() === formData.email.toLowerCase().trim()
      );

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (foundUser) {
        if (foundUser.password === formData.password) {
          // Create session without password
          const sessionData: UserSession = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            createdAt: foundUser.createdAt
          };
          
          localStorage.setItem("ticketapp_session", JSON.stringify(sessionData));
          toast.success("Login successful! Welcome back.");
          navigate("/dashboard");
        } else {
          setErrors(prev => ({ 
            ...prev, 
            general: "Invalid email or password",
            password: "Invalid password" 
          }));
          toast.error("Invalid email or password");
        }
      } else {
        setErrors(prev => ({ 
          ...prev, 
          general: "Invalid email or password",
          email: "No account found with this email" 
        }));
        toast.error("Invalid email or password");
      }

    } catch (error) {
      console.error("Login error:", error);
      setErrors(prev => ({ 
        ...prev, 
        general: "Failed to login. Please try again." 
      }));
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      {/* Decorative circles as required */}
      {/* <DecorativeCircle position="top-10 right-10" size="lg" color="blue" />
      <DecorativeCircle position="bottom-20 left-10" size="md" color="purple" /> */}

      {/* Consistent max-width container */}
      <div className="max-w-1440 w-full flex justify-center">
        <Card className="w-full max-w-md bg-white rounded-lg shadow-lg border-0">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Ticket className="h-8 w-8 text-blue-600" aria-hidden="true" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your Clear Desk account
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error Display */}
              {errors.general && (
                <div 
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
                  role="alert"
                >
                  <p className="text-sm font-medium">{errors.general}</p>
                </div>
              )}

              {/* Demo Credentials */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-800 font-medium mb-1">Demo Credentials</p>
                <p className="text-sm text-blue-700">john@example.com / password123</p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                  autoComplete="email"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Signup Link */}
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Wave background as required */}
      <div className="absolute bottom-0 left-0 w-full">
        <WaveBackground />
      </div>
    </div>
  );
};

export default Login;