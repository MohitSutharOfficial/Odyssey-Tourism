
import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, MapPinned, Globe } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    window.location.href = `/explore?query=${encodeURIComponent(query)}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-block bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium mb-6">
              Discover the world with Odyssey
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Experience Travel Like Never Before
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore destinations around the world with AI-powered recommendations, create personalized itineraries, and discover hidden gems in every city.
            </p>
            
            <div className="mt-8 mb-12">
              <SearchBar onSearch={handleSearch} placeholder="Where do you want to go?" className="max-w-xl" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full font-medium transition-all hover:bg-accent/90"
              >
                Explore Destinations
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/premium"
                className="inline-flex items-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-full font-medium transition-all hover:bg-secondary/80"
              >
                Premium Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Odyssey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with travel expertise to bring you the best travel planning experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="h-10 w-10 text-accent" />,
                title: "Personalized Recommendations",
                description: "AI-powered suggestions based on your preferences, interests, and travel history."
              },
              {
                icon: <MapPinned className="h-10 w-10 text-accent" />,
                title: "Interactive Maps",
                description: "Explore destinations with detailed maps showing points of interest, routes, and local insights."
              },
              {
                icon: <Globe className="h-10 w-10 text-accent" />,
                title: "Global Coverage",
                description: "Thousands of destinations worldwide with detailed information and authentic reviews."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={cn(
                  "glass-card p-6 text-center",
                  "transform transition-all hover:-translate-y-1 hover:shadow-md"
                )}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of travelers who have discovered perfect journeys with Odyssey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Odyssey transformed how I plan my trips. The AI recommendations were spot on and saved me hours of research.",
                author: "kishan Mudaliar.",
                title: "Adventure Traveler"
              },
              {
                quote: "The interactive maps helped me discover hidden gems I would have never found otherwise. Absolutely worth it!",
                author: "Deepak .",
                title: "Business Traveler"
              },
              {
                quote: "Premium features like the AI chatbot helped me create the perfect family vacation itinerary without any stress.",
                author: "bejendra .",
                title: "Family Explorer"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="glass-card p-6 flex flex-col h-full"
              >
                <blockquote className="flex-1 mb-4 italic text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <div className="mt-auto">
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Create your personalized travel itinerary today and explore the world like never before.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="bg-white text-accent px-6 py-3 rounded-full font-medium transition-all hover:bg-white/90"
            >
              Explore Now
            </Link>
            <Link
              to="/premium"
              className="bg-transparent border border-white px-6 py-3 rounded-full font-medium transition-all hover:bg-white/10"
            >
              Premium Features
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
