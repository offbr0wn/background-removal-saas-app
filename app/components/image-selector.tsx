"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "pexels";

type Collection = {
  description: string;
  id: number;
  media_count: number;
  photos_count: number;
  private: boolean;
  title: string;
  video_count: number;
};

type CollectionImage = {
  collection: Collection[];
  next_page: string;
  page: number;
  per_page: number;
  total_results: number;
};

type ImageType = {
  landscape: string;
  large: string;
  large2x: string;
  medium: string;
  original: string;
  portrait: string;
  small: string;
  tiny: string;
};

type FilteredImage = {
  alt: string;
  avg_color: string;
  height: number;
  id: number;
  liked: boolean;
  photographer_id: string;
  photographer_url: string;
  src: ImageType;
  type: string;
  url: string;
  width: number;
};

type ImageSelectorProps = {
  onImageSelect: (imageUrl: string) => void;
};

export function ImageSelector({ onImageSelect }: ImageSelectorProps) {
  const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY as string);
  const [sampleImages, setSampleImages] = useState<Collection[]>([]);
  const [filteredImages, setFilteredImages] = useState<FilteredImage[]>([]);

  useEffect(() => {
    client.collections
      .featured({ per_page: 4, type: "photos", page: Math.floor(Math.random() * 50) + 1 })
      // @ts-ignore
      .then(({ collections }) => {
        setSampleImages(collections);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const searchImages = useCallback((id: number) => {
    client.collections
      .media({ per_page: 6, id, type: "photos" })
      // @ts-ignore
      .then(({ media }) => {
        setFilteredImages(media);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-white">
        <h3 className="text-lg font-semibold mb-2">No image?</h3>
        <p className="text-sm text-white/70 mb-4">
          Try one of these categories for more:
        </p>
      </div>

      {/* Sample Categories */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 ">
        {sampleImages.map((category) => (
          <motion.button
            key={category?.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
            onClick={() => {
              searchImages(category.id);
            }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
              <span className="text-white font-bold md:text-lg text-[50%]">
                {category.title}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Search Bar */}
      {/* <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for images..."
            className="bg-white text-gray-900 pl-10 rounded-lg w-full"
            onKeyPress={(e) => e.key === "Enter" && searchImages()}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button
          onClick={searchImages}
          className="bg-white text-gray-900 hover:bg-gray-100"
        >
          Search
        </Button>
      </div> */}

      {/* Search Results */}
      {filteredImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {filteredImages.map((image) => (
            <motion.button
              key={image.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
              onClick={() =>
                onImageSelect(image?.src?.large || "/placeholder.svg")
              }
            >
              <img
                src={image?.src?.large || "/placeholder.svg"}
                alt={image?.alt || ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Terms and Privacy Notice */}
      <p className="text-sm text-white/50 mt-4">
        By selecting an image you agree to our{" "}
        <a href="/terms" className="underline hover:text-white">
          Terms of Service
        </a>
        . To learn more about how we handle your data, check our{" "}
        <a href="/privacy" className="underline hover:text-white">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
