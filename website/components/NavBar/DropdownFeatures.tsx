import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ListChecks, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const DropdownFeatures = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <DropdownMenu open={isOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center text-lg p-0 hover:bg-transparent ring-offset-transparent focus-visible:ring-transparent"
            onClick={() => setIsOpen((prev) => !prev)} // Toggle dropdown on click
          >
            Features
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href="/#ProductFeatures"
                className="flex items-center gap-2 w-full text-lg"
              >
                <ListChecks className="h-4 w-4" />
                Product Features
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/#AppFeatures"
                className="flex items-center gap-2 w-full text-lg"
              >
                <Smartphone className="h-4 w-4" />
                App Features
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownFeatures;
