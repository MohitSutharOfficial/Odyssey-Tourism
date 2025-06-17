
import { toast } from "sonner";

// Types for our data
export interface TouristPlace {
  id: string;
  name: string;
  rating: number;
  imageUrl: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;  // Added address as optional property
  };
  address: string;  // Existing property at root level
  category: string;
  specialFeatures?: string[];  // Added as optional
  bestTimeToVisit?: string;    // Added as optional
  businessFeatures?: {
    website?: string;
    phone?: string;
    openingHours?: string;
    amenities?: string[];
    isBusinessFriendly?: boolean;
    conferenceSpace?: boolean;
    wifiAvailable?: boolean;
  };
}

// For simplicity, we're using a mock API with sample data
// In a real app, this would connect to a real API

// Mock tourist places data
const mockPlaces: TouristPlace[] = [
  {
    id: "1",
    name: "Ahmedabad Junction",
    rating: 4.2,
    imageUrl: "https://wikiwandv2-19431.kxcdn.com/_next/image?url=https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Ahmedabad_Junction_railway_station_-_Main_Entrance.jpg/640px-Ahmedabad_Junction_railway_station_-_Main_Entrance.jpg&w=640&q=50",
    description: "Historic railway station in the heart of Ahmedabad. Built during the British colonial era, it features impressive Indo-Saracenic architecture and serves as the main railway hub for the city.",
    location: {
      lat: 23.025,
      lng: 72.571
    },
    address: "Railway Station Rd, Kalupur, Ahmedabad",
    category: "Transport Hub",
    specialFeatures: ["Historic Indo-Saracenic Architecture", "Multiple Platforms", "Food Stalls", "Cloak Room Facility"],
    bestTimeToVisit: "Early morning or late evening to avoid crowds",
    businessFeatures: {
      isBusinessFriendly: true,
      wifiAvailable: true,
      amenities: ["Waiting Lounges", "Food Court", "Taxi Services"],
      openingHours: "24/7"
    }
  },
  {
    id: "2",
    name: "Sabarmati Ashram",
    rating: 4.7,
    imageUrl: "https://th.bing.com/th/id/OIP.otdp2mbenmuOibUsPL2U5QHaEO?r=0&rs=1&pid=ImgDetMain",
    description: "Historic residence of Mahatma Gandhi during India's independence movement. A place of pilgrimage that offers insights into Gandhi's life and philosophy through exhibitions, archives, and preserved living quarters.",
    location: {
      lat: 23.0591,
      lng: 72.5754
    },
    address: "Ashram Road, Ahmedabad",
    category: "Historic Site",
    specialFeatures: ["Gandhi's Living Quarters", "Museum Exhibits", "Peaceful Gardens", "Library with Rare Documents"],
    bestTimeToVisit: "October to March when the weather is pleasant",
    businessFeatures: {
      website: "www.gandhiashramsabarmati.org",
      openingHours: "8:30 AM - 6:30 PM",
      amenities: ["Guided Tours", "Library", "Museum"],
      conferenceSpace: true
    }
  },
  {
    id: "3",
    name: "Kankaria Lake",
    rating: 4.5,
    imageUrl: "https://4.bp.blogspot.com/-SQMg8uYSHjI/UjH3fnWTErI/AAAAAAAAA8g/nCeFPqoO_uQ/s1600/kankaria+lake+ahmedabad+places4traveler.jpg",
    description: "A beautiful lakefront with recreational activities and scenic views. This 15th-century artificial lake offers boating, a toy train, kids' city, zoo, and various food stalls, making it perfect for family outings.",
    location: {
      lat: 23.0079,
      lng: 72.6028
    },
    address: "Maninagar, Ahmedabad",
    category: "Lake",
    specialFeatures: ["Boat Rides", "Toy Train", "Zoo", "Balloon Safari", "Dutch Garden"],
    bestTimeToVisit: "Evening hours, especially during the Kankaria Carnival in December",
    businessFeatures: {
      openingHours: "9:00 AM - 10:00 PM",
      amenities: ["Boating", "Food Courts", "Entertainment"],
      wifiAvailable: true
    }
  },
  {
    id: "4",
    name: "Jama Masjid",
    rating: 4.6,
    imageUrl: "https://th.bing.com/th/id/OIP.KoenD5iBRrDrRKhiO3GNVQHaET?r=0&rs=1&pid=ImgDetMain",
    description: "Built in 1424, one of India's most beautiful mosques with intricate carvings. This architectural marvel features 260 columns supporting 15 domes at different elevations, showcasing the blend of Hindu and Islamic architectural styles.",
    location: {
      lat: 23.0249,
      lng: 72.5797
    },
    address: "Manek Chowk, Gandhi Road, Ahmedabad",
    category: "Religious Site",
    specialFeatures: ["260 Intricately Carved Pillars", "15 Domes", "Yellow Sandstone Architecture", "Peaceful Courtyard"],
    bestTimeToVisit: "Early morning or just before sunset for the best lighting",
    businessFeatures: {
      openingHours: "6:00 AM - 8:00 PM",
      amenities: ["Guided Tours", "Historic Architecture"]
    }
  },
  {
    id: "5",
    name: "ISKCON Temple",
    rating: 4.8,
    imageUrl: "https://ahmedabadtourism.in/images/places-to-visit/headers/iskcon-temple-ahmedabad-tourism-entry-fee-timings-holidays-reviews-header.jpg",
    description: "Beautiful modern temple dedicated to Lord Krishna. The temple complex features stunning architecture, peaceful gardens, a vegetarian restaurant, and regular cultural events including traditional music and dance performances.",
    location: {
      lat: 23.0727,
      lng: 72.5175
    },
    address: "S.G. Highway, Satellite, Ahmedabad",
    category: "Religious Site",
    specialFeatures: ["Beautiful Marble Architecture", "Multimedia Exhibits", "Morning and Evening Aarti", "Cultural Performances"],
    bestTimeToVisit: "During festival celebrations like Janmashtami or for evening aarti at 7:00 PM",
    businessFeatures: {
      website: "www.iskcontempleahmedabad.com",
      openingHours: "4:30 AM - 9:00 PM",
      phone: "+91 79 2685 1945",
      amenities: ["Restaurant", "Gift Shop", "Library"],
      conferenceSpace: true
    }
  },
  {
    id: "6",
    name: "Adalaj Stepwell",
    rating: 4.7,
    imageUrl: "https://www.gosahin.com/go/p/f/1545473329_adalaj-stepwell1.jpg",
    description: "Intricately carved five-story stepwell built in 1499. This architectural wonder showcases the Indo-Islamic fusion style with beautiful carvings of flowers, animals, and mythological scenes throughout its octagonal structure.",
    location: {
      lat: 23.1645,
      lng: 72.5803
    },
    address: "Adalaj, Gandhinagar",
    category: "Historic Site",
    specialFeatures: ["Five-Story Octagonal Structure", "Intricate Stone Carvings", "Ancient Water Conservation System", "Islamic-Hindu Fusion Architecture"],
    bestTimeToVisit: "October to March, preferably during early morning for the best photographs",
    businessFeatures: {
      openingHours: "8:00 AM - 6:00 PM",
      amenities: ["Guided Tours", "Photography Spots"]
    }
  },
  {
    id: "7",
    name: "Ahmedabad One Mall",
    rating: 4.4,
    imageUrl: "https://im.whatshot.in/img/2023/Mar/ahmedabad-home-banner-1-new-1679487768.jpg",
    description: "Ahmedabad's premium shopping and entertainment destination. This upscale mall features international brands, fine dining restaurants, a multiplex cinema, and various entertainment options for visitors of all ages.",
    location: {
      lat: 23.0374,
      lng: 72.5312
    },
    address: "Vastrapur, Ahmedabad",
    category: "Shopping",
    specialFeatures: ["International Brand Outlets", "INOX Multiplex", "Food Court", "Gaming Zone", "Dedicated Children's Play Area"],
    bestTimeToVisit: "Weekdays to avoid crowds, especially during sale seasons",
    businessFeatures: {
      website: "www.ahmedabadone.com",
      openingHours: "10:00 AM - 10:00 PM",
      phone: "+91 79 4086 8600",
      amenities: ["Food Court", "Cinema", "Branded Stores"],
      isBusinessFriendly: true,
      wifiAvailable: true,
      conferenceSpace: true
    }
  },
  {
    id: "8",
    name: "The House of MG",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
    description: "Historic boutique hotel in a restored mansion with traditional Gujarati restaurant. This heritage hotel offers luxurious accommodations in a beautifully preserved 20th-century mansion, complete with period furniture and modern amenities.",
    location: {
      lat: 23.0257,
      lng: 72.5845
    },
    address: "Lal Darwaja, Ahmedabad",
    category: "Accommodation",
    specialFeatures: ["Heritage Architecture", "Agashiye Rooftop Restaurant", "Traditional Gujarati Thali", "Gallery Shop", "Indoor Pool"],
    bestTimeToVisit: "October to March for the best weather when enjoying the rooftop restaurant",
    businessFeatures: {
      website: "www.houseofmg.com",
      openingHours: "24/7",
      phone: "+91 79 2550 6946",
      amenities: ["Heritage Rooms", "Fine Dining", "Gallery", "Spa"],
      isBusinessFriendly: true,
      wifiAvailable: true,
      conferenceSpace: true
    }
  }
];

// Get popular destinations for auto-suggestions
export const getPopularDestinations = async (): Promise<string[]> => {
  // This would normally be an API call
  return [
    "Ahmedabad",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Kolkata",
    "Chennai",
    "Jaipur",
    "Agra",
    "Goa",
    "Varanasi"
  ];
};

// Search for tourist places based on city
export const searchPlaces = async (query: string): Promise<TouristPlace[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  try {
    // In a real app, this would be an API call
    if (query.toLowerCase().includes('ahmedabad')) {
      return mockPlaces;
    }
    
    // Return empty for other searches for demo purposes
    return [];
  } catch (error) {
    console.error("Error searching places:", error);
    toast.error("Failed to search places. Please try again.");
    return [];
  }
};

// Get business-friendly places
export const getBusinessFriendlyPlaces = async (): Promise<TouristPlace[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    return mockPlaces.filter(place => place.businessFeatures?.isBusinessFriendly);
  } catch (error) {
    console.error("Error getting business places:", error);
    toast.error("Failed to get business places");
    return [];
  }
};

// Filter places by category
export const filterPlacesByCategory = async (category: string): Promise<TouristPlace[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    return mockPlaces.filter(place => place.category === category);
  } catch (error) {
    console.error("Error filtering places:", error);
    toast.error("Failed to filter places");
    return [];
  }
};

// Get place details
export const getPlaceDetails = async (placeId: string): Promise<TouristPlace | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  try {
    const place = mockPlaces.find(p => p.id === placeId);
    return place || null;
  } catch (error) {
    console.error("Error getting place details:", error);
    toast.error("Failed to get place details");
    return null;
  }
};
