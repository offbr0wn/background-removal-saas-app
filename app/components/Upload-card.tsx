"use client";

import { useState } from "react";
import { Upload, FileType, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
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

  const handleBackgroundRemoval = async () => {
    const image_url =
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

    const res = await fetch("/api/background-removal", {
      method: "POST",
      body: JSON.stringify({ image_url }),
    });
    const data = await res.json();
    console.log("removing",data);
  };
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
          {/* 
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept="image/*"
          /> */}

          {preview ? (
            <div className="max-w-72 max-h-96 rounded-2xl bg-white/10 flex items-center justify-center mb-4  transition-all duration-200">
              <img src={preview} alt="File Preview" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-white/70" />
            </div>
          )}
          <Button
            variant="secondary"
            className="bg-white hover:bg-white/90 text-black border-0 mb-4 relative"
            asChild
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {fileName ? fileName : "Upload File"}
            </label>
          </Button>

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

          {fileName ? (
            <Button
              className="bg-blue-900 hover:bg-blue-700 text-white  transition-all duration-200 cursor-pointer "
              onClick={handleBackgroundRemoval}
            >
              Remove Background
            </Button>
          ) : (
            <div className="flex items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <FileType className="h-4 w-4" />
                <span>PNG, JPG, WEBP</span>
              </div>
              <div className="flex items-center gap-1">
                <Link className="h-4 w-4" />
                <span>or paste a URL</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
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
