import React from "react";
import Featured from "./Featured";
import Recent from "./Recent";

const Main = () => {
  return (
    <div>
      {/* Featured Posts */}
      <Featured />

      {/* Recent Posts */}
      <Recent />
    </div>
  );
};

export default Main;
