"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function PropertiesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/properties/for-sale");
  }, [router]);

  return <Loading />;
}
