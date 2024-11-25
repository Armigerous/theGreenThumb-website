import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarItem,
  Dropdown,
} from "@nextui-org/react";
import { ChevronDownIcon, ListChecksIcon, SmartphoneIcon } from "lucide-react";
import React from "react";

const DropdownFeatures = () => {
  return (
    <Dropdown>
      {/* Features dropdown */}
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            className="p-0 bg-transparent data-[hover=true]:bg-transparent text-xl"
            endContent={<ChevronDownIcon />}
          >
            Features
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="The GreenThumb features"
        className="w-[340px]"
        itemClasses={{
          base: "gap-4",
        }}
      >
        <DropdownItem
          key="Product Features"
          description="ACME scales apps to meet user demand, automagically, based on load."
          startContent={<SmartphoneIcon />}
        >
          Product Features
        </DropdownItem>
        <DropdownItem
          key="App Features"
          description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
          startContent={<ListChecksIcon />}
        >
          App Features
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownFeatures;
