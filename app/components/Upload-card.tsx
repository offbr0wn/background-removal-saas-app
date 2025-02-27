"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { motion } from "framer-motion";

export function UploadCard({ highlight }: { highlight: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const [urlInput, setUrlInput] = useState<string>("");
  const [assignUrlLink, setAssignUrlLink] = useState<string>("");
  const [loadingButton, setLoadingButton] = useState(false);
  const router = useRouter();

  // Limit before requiring signup

  useEffect(() => {
    if (highlight && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

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
    const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "File size limit exceeded",
        description: "Upload another file less than 4.5MB",
      });
      return;
    }
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
          duration: 2000,
          title: "API limit reached",
          description:
            `Please wait for next next month for your usage to reset. or proceed to purchase Pro tier, ${processedImage.error}`,
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
        setLoadingButton(true);
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
        setLoadingButton(false);
        setUrlInput("");
        setIsUrlInputVisible(false);
        toast({
          description: "Image loaded successfully",
        });
      } catch (error) {
        console.error("Error loading image:", error);
        toast({
          duration: 2000,
          variant: "destructive",
          title: "Image not loaded successfully",
          description: "Try another link or upload an image",
        });
      }
    },
    [urlInput, preview]
  );

  const highlightVariants = {
    initial: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
    highlight: {
      boxShadow: [
        "0 0 0 0 rgba(59, 130, 246, 0)",
        "0 0 0 15px rgba(59, 130, 246, 0.3)",
        "0 0 0 0 rgba(59, 130, 246, 0)",
      ],

      transition: {
        duration: 1.5,
        repeat: 3,
        ease: "easeInOut",
      },
    },
  };

  return (
    // <BackgroundGradient className="bg-black rounded-2xl w-full p-2  ">
    <motion.div
      ref={cardRef}
      className="w-full  relative"
      animate={highlight ? { scale: 1.1 } : "initial"}
      variants={highlightVariants}
      whileHover={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 8 }}
    >
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
            <div className="max-w-70 max-h-96 rounded-2xl bg-white/10 flex items-center justify-center mb-5  transition-all duration-500">
              <img
                src={preview}
                alt="File Preview"
                className=" max-h-80 max-w-full rounded-2xl"
              />

              {!loadingButton ? (
                <motion.button
                  className="absolute top-35 right-12 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                  onClick={() => setPreview(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              ) : null}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-white/70" />
            </div>
          )}
          {/* Logic for upload button shows button when no image is uploaded */}
          {!preview && (
            <Button
              variant="secondary"
              className="bg-white hover:bg-white/90 text-black border-0 mb-4 relative"
              asChild
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                {preview ? fileName : "Upload File"}
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
          {preview ? (
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
                <span>PNG, JPG, WEBP, AVIF</span>
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
            <div className="flex items-center gap-2 dark">
              <Input
                type="url"
                placeholder="Paste Your Image URL To Download Here"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-grow bg-white/20 text-white border-transparent focus-visible:border-transparent focus-visible:ring-0 placeholder-white "
              />
              <Button
                type="submit"
                className="bg-white hover:bg-white/30 text-black hover:text-white "
              >
                {loadingButton ? <LoadingSpinner /> : "Load"}
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
            className="mt-4 text-black hover:text-white bg-white hover:bg-white/30 cursor-pointer  font-bold font-2xl w-full  duration-1000 transition-discrete border-dashed border-3 border-white/40"
            onClick={() => setIsUrlInputVisible(true)}
          >
            <Link className="mr-2 h-4 w-4  hover:bg-white" />
            Paste Image URL here
          </Button>
        )}

        {/* Quick Actions  for later features down the line */}
        <div className="mt-6 grid grid-cols-1 gap-4">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 "
          >
            Sample images
          </Button>
          {/* <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Bulk upload
          </Button> */}
        </div>
      </div>
    </motion.div>
  );
}
