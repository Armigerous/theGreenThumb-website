"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/smart-image";

type PlantImageGalleryProps = {
  images: {
    img: string;
    thumbnail_med?: string;
    altText?: string;
    caption?: string;
    attribution?: string;
  }[];
};

const ImageGallery: React.FC<PlantImageGalleryProps> = ({ images }) => {
  const validImages = images?.filter((img) => img?.img) || [];
  const [selectedImage, setSelectedImage] = useState(validImages[0]?.img);

  if (validImages.length === 0) {
    return <p className="text-cream-500">No images available.</p>;
  }

  const currentImage = validImages.find((img) => img.img === selectedImage);

  return (
    <div className="space-y-4">
      {/* Main Display Image with Dialog Trigger */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative w-full max-w-3xl h-[500px] bg-cream-100 rounded-lg overflow-hidden cursor-pointer">
            <OptimizedImage
              src={selectedImage}
              alt={currentImage?.altText || "Plant image"}
              context="gallery"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{currentImage?.altText || "Image View"}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh]">
            <OptimizedImage
              src={selectedImage}
              alt={currentImage?.altText || "Plant image"}
              context="detail"
              className="object-contain rounded-lg"
              fill
            />
          </div>
          {currentImage?.caption && (
            <p className="text-sm text-cream-600 mt-2">
              {currentImage.caption}
            </p>
          )}
          {currentImage?.attribution && (
            <p className="text-sm text-cream-500 mt-2">
              Attribution: {currentImage.attribution}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      <div className="flex gap-4 p-4 px-0">
        {validImages.slice(0, 5).map((image, index) => (
          <Button
            key={index}
            onClick={() => setSelectedImage(image.img)}
            className={`relative w-24 h-24 bg-cream-100 rounded-lg overflow-hidden border ${
              selectedImage === image.img
                ? "border-brand-500"
                : "border-cream-300"
            } hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-700`}
          >
            <OptimizedImage
              src={image.thumbnail_med || image.img}
              alt={image.altText || `Thumbnail ${index + 1}`}
              context="thumbnail"
              className="object-cover w-full h-full"
              fill
            />
          </Button>
        ))}
        {validImages.length > 5 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-24 h-24 bg-cream-100 rounded-lg border border-cream-300 text-cream-600">
                +{validImages.length - 5}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl">
              <DialogHeader>
                <DialogTitle>All Images</DialogTitle>
              </DialogHeader>
              <div className="flex gap-4 h-[80vh]">
                {/* Large Main Image */}
                <div className="flex-1 relative bg-cream-100 rounded-lg">
                  <OptimizedImage
                    src={selectedImage}
                    alt={currentImage?.altText || "Main image"}
                    context="detail"
                    className="object-contain rounded-lg"
                    fill
                    priority
                  />
                </div>
                {/* Thumbnail Column */}
                <div className="w-1/3 h-full overflow-y-auto bg-cream-50 rounded-lg p-4 space-y-4">
                  {validImages.map((image, index) => (
                    <Button
                      key={index}
                      onClick={() => setSelectedImage(image.img)}
                      className={`relative w-full h-24 bg-cream-100 rounded-lg overflow-hidden border ${
                        selectedImage === image.img
                          ? "border-brand-500"
                          : "border-cream-300"
                      } hover:shadow focus:outline-none focus:ring-2 focus:ring-brand-500`}
                    >
                      <OptimizedImage
                        src={image.thumbnail_med || image.img}
                        alt={image.altText || `Thumbnail ${index + 1}`}
                        context="thumbnail"
                        className="object-cover w-full h-full"
                        fill
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
