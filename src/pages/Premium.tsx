import { Check, X, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features,
  notIncluded,
  highlighted = false,
  buttonText = "Get Started",
  buttonHref = "/explore"
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  notIncluded?: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonHref?: string;
}) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 flex flex-col h-full",
        highlighted && "border-accent/50 ring-1 ring-accent/20 shadow-lg relative overflow-hidden"
      )}
    >
      {highlighted && (
        <div className="absolute top-0 right-0">
          <div className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground ml-1">/month</span>}
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex-1 mb-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
          
          {notIncluded && notIncluded.map((feature, index) => (
            <li key={index} className="flex items-start text-muted-foreground">
              <X className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Link
        to={buttonHref}
        className={cn(
          "w-full py-2 rounded-lg font-medium text-center transition-all",
          highlighted
            ? "bg-accent text-white hover:bg-accent/90"
            : "bg-secondary text-foreground hover:bg-secondary/80"
        )}
      >
        {buttonText}
      </Link>
    </div>
  );
};

const Premium = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium mb-6">
          <Crown className="h-4 w-4 mr-1" />
          Premium Features
        </div>
        <h1 className="text-4xl font-bold mb-4">Elevate Your Travel Experience</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your travel style and unlock premium features to make every journey unforgettable.
        </p>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <PricingCard
          title="Free"
          price="Free"
          description="Essential features for occasional travelers"
          features={[
            "Search for tourist destinations",
            "Basic map views",
            "Save up to 5 places in itinerary",
            "Access community reviews"
          ]}
          notIncluded={[
            "AI-powered recommendations",
            "Offline maps access",
            "Premium tourist spots",
            "Trip planning assistant"
          ]}
          buttonText="Start Free"
        />
        
        <PricingCard
          title="Premium"
          price="$9.99"
          description="Advanced features for serious travelers"
          features={[
            "Everything in Free plan",
            "AI-powered recommendations",
            "Offline maps access",
            "Unlimited itinerary places",
            "Priority customer support",
            "Ad-free experience"
          ]}
          notIncluded={[
            "AI travel assistant",
            "Business listings",
            "Premium tourist spots"
          ]}
          highlighted={true}
          buttonText="Go Premium"
        />
        
        <PricingCard
          title="Business"
          price="$19.99"
          description="Complete solution for travel businesses"
          features={[
            "Everything in Premium plan",
            "AI travel planning assistant",
            "Business listings & promotion",
            "Analytics dashboard",
            "API access",
            "White label options",
            "Dedicated account manager"
          ]}
          buttonText="Contact Sales"
        />
      </div>
      
      {/* Features Section */}
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our Premium subscription worth every penny.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "AI-Powered Recommendations",
              description: "Get personalized travel suggestions based on your preferences, past trips, and current interests through our advanced AI."
            },
            {
              title: "Offline Maps Access",
              description: "Download maps and itineraries for offline access when traveling in areas with limited connectivity."
            },
            {
              title: "Premium Tourist Spots",
              description: "Discover hidden gems and exclusive locations not available to free users, curated by local experts."
            },
            {
              title: "AI Travel Assistant",
              description: "Chat with our AI assistant to get real-time help with planning, local recommendations, and travel tips."
            }
          ].map((feature, index) => (
            <div key={index} className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-accent text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Travel Experience?</h2>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          Upgrade to Premium today and unlock all the features you need for unforgettable journeys.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center bg-white text-accent px-6 py-3 rounded-full font-medium transition-all hover:bg-white/90"
        >
          Start Exploring
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default Premium;
