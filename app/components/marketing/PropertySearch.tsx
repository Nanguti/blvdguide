import React, { useCallback } from 'react';
import { useRouter } from 'next/router';

const PropertySearch: React.FC = () => {
  const router = useRouter();

  const handleSearch = useCallback(() => {
    const searchParams = new URLSearchParams();
    if (location) searchParams.set("location", location);
    if (propertyType) searchParams.set("propertyType", propertyType);
    if (status) searchParams.set("status", status);
    router.push(`/properties?${searchParams.toString()}`);
  }, [location, propertyType, status, router]);

  return (
    // ... rest of the component ...
  );
};

export default PropertySearch; 