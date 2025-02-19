export interface Property {
  id: number;
  title: string;
  price: number;
  location: {
    city: {
      name: string;
      state: {
        name: string;
      };
    };
    longitude: number;
    latitude: number;
  };
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  featured_image: string;
  images: string[];
  amenities: Amenity[];
  imageUrl: string;
  description: string;
  is_favorited: boolean;
  created_at: string;
  updated_at: string;
  agent: Agent;
}

export interface PropertyFilter {
  type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  amenities?: string[];
  city_id?: string;
  area_id?: string;
  sort?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  experience: number;
  properties: number;
  rating: number;
  specialization: string;
  languages: string[];
  about: string;
  agency?: Agency;
}

export interface Agency {
  id: string;
  name: string;
  logo: string;
}

export interface City {
  id: string;
  name: string;
  state: State;
}

export interface Area {
  id: string;
  name: string;
  city: City;
}

export interface State {
  id: string;
  name: string;
  country: Country;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}
