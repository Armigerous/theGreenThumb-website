import React from "react";

interface AboutLayoutProps {
  children: React.ReactNode;
}

const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default AboutLayout;
