import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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

  return (
    <div className="flex gap-4">
      <Input
        type="text"
        placeholder="Enter location..."
        value={search.location}
        onChange={(e) =>
          setSearch((prev) => ({ ...prev, location: e.target.value }))
        }
      />
      <Button onClick={handleSearch}>
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
};

export default PropertySearch;
