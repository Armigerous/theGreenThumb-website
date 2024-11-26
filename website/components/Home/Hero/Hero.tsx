import { MaxWidthWrapper } from "@/components/maxWidthHeader";
import Model from "./Model";
import Text from "./Text";

const Hero = () => {
  return (
    <main>
      <MaxWidthWrapper className="flex flex-col md:flex-row w-full h-auto md:h-screen justify-between items-center">
        {/* Hero Section Text + 3D Model */}
        <Text />
        <Model />
      </MaxWidthWrapper>
    </main>
  );
};

export default Hero;
