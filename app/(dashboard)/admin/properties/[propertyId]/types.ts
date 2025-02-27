export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PropertyMedia {
  id: number;
  type: string;
  url: string;
  is_featured: boolean;
  sort_order: number;
}

export interface PropertyParams {
  propertyId: string;
}
