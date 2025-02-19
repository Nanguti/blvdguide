"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsUp, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  is_owner: boolean;
}

interface PropertyReviewsProps {
  propertyId: string;
}

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const { data: reviews, refetch } = useQuery<Review[]>({
    queryKey: ["propertyReviews", propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}/reviews`);
      return response.json();
    },
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/properties/${propertyId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      setShowReviewForm(false);
      setNewReview({ rating: 0, comment: "" });
      refetch();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    try {
      await fetch(`/api/properties/${propertyId}/reviews/${reviewId}/like`, {
        method: "POST",
      });
      refetch();
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await fetch(`/api/properties/${propertyId}/reviews/${reviewId}`, {
        method: "DELETE",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Reviews</h2>
          <p className="text-gray-500">
            {reviews?.length || 0} reviews for this property
          </p>
        </div>
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>
          Write a Review
        </Button>
      </div>

      <AnimatePresence>
        {showReviewForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitReview}
            className="mb-8 overflow-hidden"
          >
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Rating:</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className="focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6 transition-colors",
                          star <= newReview.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Share your experience with this property..."
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newReview.rating || !newReview.comment.trim()}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {reviews?.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b last:border-0 pb-6 last:pb-0"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{review.user.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              {review.is_owner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600"
                    >
                      Delete Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeReview(review.id)}
                className={cn(
                  "text-gray-500 hover:text-primary",
                  review.is_liked && "text-primary"
                )}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {review.likes_count}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
