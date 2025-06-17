
import { useState } from "react";
import { Star, Globe, Clock, Wifi, Users, ArrowUpRight, MapPin, MessageSquare, ThumbsUp, ThumbsDown, Camera, Calendar, Phone, X, Share2, Heart, ChevronRight, Building, Award } from "lucide-react";
import { TouristPlace } from "@/services/api";
import { cn } from "@/lib/utils";
import Map from "@/components/Map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useItinerary } from "@/context/ItineraryContext";

interface PlaceDetailsProps {
  place: TouristPlace;
  onClose?: () => void;
}

// Mock reviews data
const mockReviews = [
  {
    id: "r1",
    author: "John Doe",
    avatar: "JD",
    rating: 5,
    date: "2 months ago",
    content: "This place is amazing! The architecture is stunning and the history is fascinating. Highly recommend visiting early in the morning to avoid crowds.",
    helpful: 24,
    notHelpful: 2,
    images: ["https://images.unsplash.com/photo-1536599524557-5f784dd53282?q=80&w=300"]
  },
  {
    id: "r2",
    author: "Alice Smith",
    avatar: "AS",
    rating: 4,
    date: "1 month ago",
    content: "Great place to visit. The only downside was the limited parking available. The guided tour was very informative and worth the extra cost.",
    helpful: 18,
    notHelpful: 1,
    images: []
  },
  {
    id: "r3",
    author: "Mike Johnson",
    avatar: "MJ",
    rating: 4.5,
    date: "3 weeks ago",
    content: "Beautiful location with plenty of photo opportunities. The cafe on site serves decent food at reasonable prices. Would definitely visit again!",
    helpful: 12,
    notHelpful: 0,
    images: ["https://images.unsplash.com/photo-1606298855779-db54e777f2c8?q=80&w=300", "https://images.unsplash.com/photo-1594108047353-0a54dd398782?q=80&w=300"]
  },
  {
    id: "r4",
    author: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    date: "1 week ago",
    content: "An absolute gem! The cultural significance of this place cannot be overstated. The staff were knowledgeable and friendly. I learned so much about the local history and traditions.",
    helpful: 8,
    notHelpful: 0,
    images: []
  }
];

// Mock nearby attractions
const mockNearbyAttractions = [
  {
    name: "City Museum",
    distance: "1.2 km",
    rating: 4.3
  },
  {
    name: "Central Park",
    distance: "0.8 km",
    rating: 4.6
  },
  {
    name: "Heritage Cafe",
    distance: "0.5 km",
    rating: 4.1
  }
];

const PlaceDetails = ({ place, onClose }: PlaceDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});
  const { addToItinerary, removeFromItinerary, isInItinerary } = useItinerary();

  const isInUserItinerary = isInItinerary(place.id);

  const handleMarkHelpful = (reviewId: string, isHelpful: boolean) => {
    if (helpfulReviews[reviewId]) {
      toast.info("You've already rated this review");
      return;
    }

    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: true
    }));

    toast.success(isHelpful ? "Marked review as helpful" : "Marked review as not helpful");
  };

  const handleAddRemove = () => {
    if (isInUserItinerary) {
      removeFromItinerary(place.id);
      toast.success(`Removed ${place.name} from your itinerary`);
    } else {
      addToItinerary(place);
      toast.success(`Added ${place.name} to your itinerary`);
    }
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    toast.success("Share link copied to clipboard");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with large image */}
      <div className="relative h-64 md:h-96">
        <img 
          src={place.imageUrl} 
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
        
        {/* Close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors z-10"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-background/20 text-white backdrop-blur-sm">
              {place.category}
            </Badge>
            <div className="flex items-center text-white text-sm">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{place.rating}/5</span>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white">{place.name}</h1>
          
          <div className="flex items-center mt-2 text-white/80 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{place.address}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex px-4 py-2 border-b gap-2 overflow-x-auto">
        <Button 
          variant={isInUserItinerary ? "destructive" : "default"}
          size="sm"
          className="flex items-center gap-1.5"
          onClick={handleAddRemove}
        >
          {isInUserItinerary ? (
            <>
              <X className="h-4 w-4" />
              <span>Remove from Itinerary</span>
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              <span>Add to Itinerary</span>
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1.5"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
        
        {place.businessFeatures?.website && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => window.open(place.businessFeatures?.website?.startsWith('http') ? 
              place.businessFeatures.website : 
              `https://${place.businessFeatures.website}`, '_blank')}
          >
            <Globe className="h-4 w-4" />
            <span>Website</span>
          </Button>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="flex-1 overflow-hidden">
        <div className="px-4 border-b">
          <TabsList className="w-full justify-start py-1 h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-accent/10">Overview</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-accent/10">Reviews</TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-accent/10">Map</TabsTrigger>
            <TabsTrigger value="nearby" className="data-[state=active]:bg-accent/10">Nearby</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 h-[calc(100%-12rem)]">
          {/* Overview Tab */}
          <TabsContent value="overview" className="p-4 space-y-6 mt-0">
            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-muted-foreground">{place.description}</p>
            </div>

            {/* Highlights */}
            {place.specialFeatures && place.specialFeatures.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {place.specialFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="p-1.5 bg-accent/10 rounded-full text-accent">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="text-sm">{feature}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Key Information */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Key Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-accent/10 rounded-full text-accent">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground text-sm">{place.address}</p>
                  </div>
                </div>
                
                {/* Best time to visit */}
                {place.bestTimeToVisit && (
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-accent/10 rounded-full text-accent">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Best Time to Visit</h3>
                      <p className="text-muted-foreground text-sm">{place.bestTimeToVisit}</p>
                    </div>
                  </div>
                )}
                
                {/* Business Features */}
                {place.businessFeatures && (
                  <>
                    {place.businessFeatures.isBusinessFriendly && (
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-accent/10 rounded-full text-accent">
                          <Building className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">Business Friendly</h3>
                          <p className="text-muted-foreground text-sm">This location is suitable for business travelers</p>
                        </div>
                      </div>
                    )}

                    {place.businessFeatures.openingHours && (
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-accent/10 rounded-full text-accent">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">Opening Hours</h3>
                          <p className="text-muted-foreground text-sm">{place.businessFeatures.openingHours}</p>
                        </div>
                      </div>
                    )}

                    {place.businessFeatures.phone && (
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-accent/10 rounded-full text-accent">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">Phone</h3>
                          <p className="text-muted-foreground text-sm">{place.businessFeatures.phone}</p>
                        </div>
                      </div>
                    )}

                    {place.businessFeatures.wifiAvailable && (
                      <div className="flex items-start gap-2">
                        <div className="p-1.5 bg-accent/10 rounded-full text-accent">
                          <Wifi className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">Amenities</h3>
                          <p className="text-muted-foreground text-sm">Free WiFi Available</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Map preview */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <div className="h-[200px] rounded-lg overflow-hidden">
                <Map 
                  places={[place]} 
                  center={[place.location.lat, place.location.lng]} 
                  zoom={15}
                  className="h-full w-full"
                />
              </div>
              <Button variant="outline" className="w-full mt-2" onClick={() => setSelectedTab("map")}>
                View Larger Map
              </Button>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="p-4 mt-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Customer Reviews</h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400" />
                <span>{place.rating} • {mockReviews.length} reviews</span>
              </Badge>
            </div>
            
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{review.author}</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="ml-1 text-xs">{review.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="my-3 text-muted-foreground">{review.content}</p>
                  
                  {/* Review images if any */}
                  {review.images && review.images.length > 0 && (
                    <div className="my-3 flex gap-2 overflow-x-auto pb-2">
                      {review.images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Review by ${review.author}`}
                          className="h-20 w-28 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleMarkHelpful(review.id, true)}
                      disabled={Boolean(helpfulReviews[review.id])}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>Helpful ({review.helpful + (helpfulReviews[review.id] ? 1 : 0)})</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleMarkHelpful(review.id, false)}
                      disabled={Boolean(helpfulReviews[review.id])}
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span>Not helpful ({review.notHelpful})</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="h-full p-0 mt-0">
            <div className="p-4 pb-2">
              <h2 className="text-xl font-semibold mb-1">Location Map</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {place.name} is located at {place.address}
              </p>
            </div>
            <div className="h-[calc(100%-60px)]">
              <Map 
                places={[place]} 
                center={[place.location.lat, place.location.lng]} 
                zoom={15}
                className="h-full w-full"
              />
            </div>
          </TabsContent>
          
          {/* Nearby Tab */}
          <TabsContent value="nearby" className="p-4 mt-0">
            <h2 className="text-xl font-semibold mb-4">Nearby Attractions</h2>
            <div className="space-y-4">
              {mockNearbyAttractions.map((attraction, idx) => (
                <Card key={idx} className="flex items-center justify-between p-4 hover:bg-secondary/5 transition-colors cursor-pointer">
                  <div>
                    <h3 className="font-medium">{attraction.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {attraction.distance} from {place.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="ml-1 text-sm">{attraction.rating}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                View More Nearby Attractions
              </Button>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default PlaceDetails;
