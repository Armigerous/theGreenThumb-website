import { PlantData } from "@/types/plant";
import ImageGallery from "./ImageGallery";
import DOMPurify from "isomorphic-dompurify";

type PlantDetailsProps = {
  plant: PlantData;
};

const PlantDetails = ({ plant }: PlantDetailsProps) => {
  const {
    commonname_set,
    scientific_name,
    description,
    plantimage_set,
    tags,
    plant_type,
    habit,
    light,
    soil_ph,
    usda_zone,
    flower_color,
    flower_description,
    leaf_description,
    stem_description,
    maintenance,
    growth_rate,
    wildlife_value,
    resistance,
    origin,
    height_min,
    height_max,
    width_min,
    width_max,
  } = plant;

  const sanitizedDescription = DOMPurify.sanitize(description || "", {
    ALLOWED_TAGS: ["p", "strong", "em", "br", "ul", "li"],
    // Need to add support for links <a> tags
  });

  return (
    <div className="space-y-8 py-6">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        {plantimage_set && <ImageGallery images={plantimage_set} />}

        {/* Basic Details */}
        <div className="lg:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold text-green-800">
            {commonname_set?.[0] || scientific_name}
          </h1>
          <h2 className="text-xl font-serif italic text-gray-600">
            {scientific_name}
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizedDescription,
            }}
          />
        </div>
      </div>

      {/* Tags */}
      {tags && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* General Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">
          General Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Plant Type:</strong> {plant_type?.join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Habits:</strong> {habit?.join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Light:</strong> {light?.join(", ") || "Unknown"}
          </p>
          <p>
            <strong>USDA Zones:</strong> {usda_zone?.join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Soil pH:</strong> {soil_ph?.join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Origin:</strong> {origin || "Unknown"}
          </p>
          <p>
            <strong>Height:</strong> {height_min} - {height_max} inches
          </p>
          <p>
            <strong>Width:</strong> {width_min} - {width_max} inches
          </p>
          <p>
            <strong>Maintenance:</strong> {maintenance?.join(", ") || "Unknown"}
          </p>
          <p>
            <strong>Growth Rate:</strong> {growth_rate || "Unknown"}
          </p>
        </div>
      </div>

      {/* Flower Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Flower Details</h3>
        <p>{flower_description || "No flower description available."}</p>
        <p>
          <strong>Colors:</strong> {flower_color?.join(", ") || "Unknown"}
        </p>
      </div>

      {/* Leaf Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Leaf Details</h3>
        <p>{leaf_description || "No leaf description available."}</p>
      </div>

      {/* Stem Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Stem Details</h3>
        <p>{stem_description || "No stem description available."}</p>
      </div>

      {/* Wildlife and Resistance */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">
          Wildlife and Resistance
        </h3>
        <p>
          <strong>Wildlife Value:</strong> {wildlife_value || "Unknown"}
        </p>
        <p>
          <strong>Resistance:</strong> {resistance || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default PlantDetails;
