export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  property_type_id: number;
  property_status_id: number;
  city_id: number;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  year_built: number | null;
  area: number | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  propertyType?: { id: number; name: string };
  propertyStatus?: { id: number; name: string };
  city?: { id: number; name: string };
  published_status: string;
  featured_image?: string | null;
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
  category: string;
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
