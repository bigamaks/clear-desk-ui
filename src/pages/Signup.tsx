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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<FormErrors>({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { 
      name: "", 
      email: "", 
      password: "",
      confirmPassword: "" 
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if user already exists
    const existingUsers: User[] = JSON.parse(localStorage.getItem("ticketapp_users") || "[]");
    const userExists = existingUsers.some((user: User) => user.email === formData.email);
    
    if (userExists) {
      toast.error("Email already exists. Please use a different email or login.");
      setErrors(prev => ({ ...prev, email: "Email already exists" }));
      return;
    }

    setIsLoading(true);

    try {
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password, // In real app, hash this password
        createdAt: new Date().toISOString()
      };

      // Save user to localStorage
      existingUsers.push(newUser);
      localStorage.setItem("ticketapp_users", JSON.stringify(existingUsers));

      // Create session
      const sessionData: UserSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      };
      localStorage.setItem("ticketapp_session", JSON.stringify(sessionData));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Account created successfully! Welcome to Clear Desk.");
      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      {/* Decorative circles as required */}
      {/* <DecorativeCircle position="top-10 left-10" size="lg" color="blue" />
      <DecorativeCircle position="bottom-20 right-10" size="md" color="purple" /> */}

   
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
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join Clear Desk to manage your tickets efficiently
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.name ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-600" role="alert">
                    {errors.name}
                  </p>
                )}
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
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.confirmPassword ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                  }`}
                  aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="text-sm text-red-600" role="alert">
                    {errors.confirmPassword}
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Login Link */}
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  Sign in here
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

export default Signup;