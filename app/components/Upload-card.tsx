"use client";

import { useCallback, useState } from "react";
import { Upload, FileType, Link, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  uploadImageToS3,
  validateSubscription,
} from "@/api/helpers/removeBackground";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { ClerkFetchUser } from "@/api/helpers/clerk-fetch-user";
import { setApiUsageCookie } from "@/api/helpers/cookies-helper";

export function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const [urlInput, setUrlInput] = useState<string>("");
  const [assignUrlLink, setAssignUrlLink] = useState<string>("");
  const [loadingButton, setLoadingButton] = useState(false);
  const router = useRouter();
  // Limit before requiring signup

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    setFileName(file.name); // Set the file name
    reader.readAsDataURL(file);
  };

  const getBackgroundRemoval = useCallback(async () => {
    const { userId } = await ClerkFetchUser();
    if (!preview) {
      toast({ description: "No file selected" });
      return;
    }

    if (!userId) {
      if (!setApiUsageCookie()) return; // ✅ Stop if limit reached
    }
    // / ✅ Sets the cookie

    try {
      setLoadingButton(true);
      const uploadImageToAWS = await uploadImageToS3(preview, fileName);

      const processedImage = await validateSubscription({
        preview,
        fileName,
        assignUrlLink: fileName ? uploadImageToAWS : assignUrlLink,
      });

      if (processedImage?.error) {
        setLoadingButton(false);
        toast({
          title: "API limit reached",
          description:
            "Please wait for next next month for your usage to reset. or proceed to purchase Pro tier",
        });
      }
      if (!processedImage.error) {
        router.push(`/remove-background/${processedImage}`);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    }
  }, [assignUrlLink, fileName, preview, router]);

  const handleUrlSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!urlInput) return;

      try {
        const response = await fetch(urlInput);

        if (!response.ok) throw new Error("Failed to fetch image");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          // onImageUpload(dataUrl)

          setPreview(dataUrl);
          setAssignUrlLink(response?.url);
        };
        reader.readAsDataURL(blob);
        setUrlInput("");
        setIsUrlInputVisible(false);
        toast({
          description: "Image loaded successfully",
        });
      } catch (error) {
        console.error("Error loading image:", error);

        toast({
          variant: "destructive",
          description: error?.toString(),
        });
      }
    },
    [urlInput]
  );
  return (
    <div className="w-full max-w-lg">
      <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Upload your image
        </h2>
        <p className="text-white/70 mb-6">
          Drop your image here or click to browse
        </p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl
            ${
              isDragging
                ? "border-white/50 bg-white/10"
                : "border-white/20 hover:border-white/30"
            }
            transition-all duration-200
            min-h-[300px]
            flex flex-col items-center justify-center
            cursor-pointer
            p-8
          `}
        >
          {preview ? (
            <div className="max-w-70 max-h-96 rounded-2xl bg-white/10 flex items-center justify-center mb-5  transition-all duration-400">
              <img src={preview} alt="File Preview" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-white/70" />
            </div>
          )}
          {/* Logic for upload button shows button when no image is uploaded */}
          {!(fileName || preview) && (
            <Button
              variant="secondary"
              className="bg-white hover:bg-white/90 text-black border-0 mb-4 relative"
              asChild
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                {fileName || preview ? fileName : "Upload File"}
              </label>
            </Button>
          )}
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            className="hidden" // This hides the default file input
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileChange(selectedFile);
            }}
          />
          {/* Will show image preview once image is uploaded/pasted */}
          {fileName || preview ? (
            <Button
              className="bg-blue-900 hover:bg-blue-700 text-white  transition-all duration-200 cursor-pointer mt-5 p-6 font-bold text-md"
              onClick={getBackgroundRemoval}
              disabled={loadingButton}
            >
              {loadingButton ? <LoadingSpinner /> : "Remove Background"}
            </Button>
          ) : (
            <div className="flex items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <FileType className="h-4 w-4" />
                <span>PNG, JPG, WEBP</span>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <Link className="h-4 w-4" />
                <span>or paste a URL</span>
              </div>
            </div>
          )}
        </div>
        {/* URL inout field to paste a URL for image  */}
        {isUrlInputVisible ? (
          <form onSubmit={handleUrlSubmit} className="mt-4">
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-grow bg-white/10 text-white border-transparent"
              />
              <Button
                type="submit"
                className="bg-white hover:bg-white/90 text-black"
              >
                Load
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-white/70 hover:text-white"
                onClick={() => setIsUrlInputVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="ghost"
            className="mt-4 text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            onClick={() => setIsUrlInputVisible(true)}
          >
            <Link className="mr-2 h-4 w-4" />
            Paste image URL
          </Button>
        )}

        {/* Quick Actions  for later features down the line */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Sample images
          </Button>
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Bulk upload
          </Button>
        </div>
      </div>
    </div>
  );
}
