import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import WaveBackground from "@/components/Decorative/WaveBackground";
import DecorativeCircle from "@/components/Decorative/DecorativeCircle";
import { Ticket, Clock, CheckCircle, Users } from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: Ticket,
      title: "Easy Ticket Creation",
      description: "Create and organize tickets with a simple, intuitive interface designed for efficiency.",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Monitor ticket progress in real-time with instant status updates and notifications.",
    },
    {
      icon: CheckCircle,
      title: "Quick Resolution",
      description: "Streamline your workflow and resolve tickets faster with our powerful management tools.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with built-in collaboration features and team insights.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <DecorativeCircle position="top-right" size="lg" />
        
        <div className="container relative mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Manage Your Tickets with Ease
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
            A simple and powerful solution to create, track, and resolve tickets efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/login">
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary backdrop-blur-sm ocus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 ocus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <WaveBackground />
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <DecorativeCircle position="bottom-left" size="md" className="opacity-50" />
        
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage tickets effectively and keep your team productive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-none">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
