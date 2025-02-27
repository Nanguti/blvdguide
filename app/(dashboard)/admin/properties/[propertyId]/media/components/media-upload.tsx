"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/services/api";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorResponse } from "../../types";

interface MediaUploadProps {
  propertyId: string;
}

export function MediaUpload({ propertyId }: MediaUploadProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [type, setType] = useState<string>("image");
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!files) return;

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images[]", files[i]);
      }
      formData.append("type", type);

      const response = await api.post(
        `/properties/${propertyId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["propertyMedia", propertyId],
      });
      toast.success("Media uploaded successfully");
      setFiles(null);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload media";
      toast.error(errorMessage);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleUpload = () => {
    if (!files) {
      toast.error("Please select files to upload");
      return;
    }
    uploadMutation.mutate();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="media-type">Media Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select media type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="virtual_tour">Virtual Tour</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="media-files">Upload Files</Label>
        <Input
          id="media-files"
          type="file"
          multiple
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={handleFileChange}
        />
      </div>

      <Button
        onClick={handleUpload}
        disabled={!files || uploadMutation.isPending}
      >
        {uploadMutation.isPending ? "Uploading..." : "Upload Media"}
      </Button>
    </div>
  );
}
