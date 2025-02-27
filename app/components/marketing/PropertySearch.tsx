import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";

interface SearchState {
  location: string;
  propertyType: string;
  status: string;
}

const PropertySearch: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState<SearchState>({
    location: "",
    propertyType: "",
    status: "",
  });

  const handleSearch = useCallback(() => {
    const searchParams = new URLSearchParams();
    if (search.location) searchParams.set("location", search.location);
    if (search.propertyType)
      searchParams.set("propertyType", search.propertyType);
    if (search.status) searchParams.set("status", search.status);
    router.push(`/properties?${searchParams.toString()}`);
  }, [search, router]);

  return <div>{/* Search form implementation */}</div>;
};

export default PropertySearch;
