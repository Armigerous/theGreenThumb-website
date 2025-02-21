import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  size?: number;
  height?: number;
  width?: number;
}

// Define the props interface for the icon components
interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// Facebook Icon
export const FacebookIconBlack: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path d="M5 3c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2H19c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H5zm0 2h14l.002 14h-4.588v-3.965h2.365l.352-2.724H14.43v-1.737c0-.788.22-1.32 1.35-1.32h1.427V6.822a20.013 20.013 0 0 0-2.092-.103c-2.074 0-3.494 1.266-3.494 3.59v2.005H9.277v2.725h2.344V19H5V5z" />
  </svg>
);

// Instagram Icon
export const InstagramIconBlack: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path d="M8 3C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5H8zm0 2h8c1.654 0 3 1.346 3 3v8c0 1.654-1.346 3-3 3H8c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3zm9 1a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1zm-5 1c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z" />
  </svg>
);

// TikTok Icon
export const TiktokIconBlack: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path d="M6 3C4.355 3 3 4.355 3 6v12c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V6c0-1.645-1.355-3-3-3H6zm0 2h12c.565 0 1 .435 1 1v12c0 .565-.435 1-1 1H6c-.565 0-1-.435-1-1V6c0-.565.435-1 1-1zm6 2v7c0 .565-.435 1-1 1s-1-.435-1-1 .435-1 1-1v-2c-1.645 0-3 1.355-3 3s1.355 3 3 3 3-1.355 3-3v-3.768c.616.44 1.26.768 2 .768V9c-.047 0-.737-.22-1.219-.639C14.3 7.941 14 7.415 14 7h-2z" />
  </svg>
);

// YouTubeIcon
export const YoutubeIconBlack: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path d="M12 4s-6.254 0-7.814.418a2.503 2.503 0 0 0-1.768 1.768C2 7.746 2 12 2 12s0 4.254.418 5.814c.23.861.908 1.538 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.505 2.505 0 0 0 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814a2.505 2.505 0 0 0-1.768-1.768C18.254 4 12 4 12 4zm0 2c2.882 0 6.49.134 7.297.35a.508.508 0 0 1 .353.353c.241.898.35 3.639.35 5.297s-.109 4.398-.35 5.297a.508.508 0 0 1-.353.353c-.805.216-4.415.35-7.297.35-2.881 0-6.49-.134-7.297-.35a.508.508 0 0 1-.353-.353C4.109 16.399 4 13.658 4 12s.109-4.399.35-5.299a.505.505 0 0 1 .353-.351C5.508 6.134 9.118 6 12 6zm-2 2.535v6.93L16 12l-6-3.465z" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <path
      d="M21 3C11.621 3 4 10.621 4 20s7.621 17 17 17c3.71 0 7.14-1.195 9.938-3.219l13.156 13.125 2.812-2.812-13-13.032A16.923 16.923 0 0 0 38 20c0-9.379-7.621-17-17-17Zm0 2c8.297 0 15 6.703 15 15s-6.703 15-15 15S6 28.297 6 20 12.703 5 21 5Z"
      style={{
        stroke: "none",
        strokeWidth: 1,
        strokeDasharray: "none",
        strokeLinecap: "butt",
        strokeDashoffset: 0,
        strokeLinejoin: "miter",
        strokeMiterlimit: 4,
        fill: "#fff",
        fillRule: "nonzero",
        opacity: 1,
      }}
      transform="matrix(.46 0 0 .46 .293 .523)"
    />
  </svg>
);

export const Checkmark: React.FC<IconProps> = (props) => (
  <svg
    className="w-4 h-4 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

export const ChevronDown: React.FC<IconProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const AppFeatures: React.FC<IconProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path d="M6.918 14.854l2.993-3.889 3.414 2.68 2.929-3.78" />
        <path d="M19.668 2.35a1.922 1.922 0 11-1.922 1.922 1.921 1.921 0 011.922-1.922z" />
        <path d="M20.756 9.269a20.809 20.809 0 01.194 3.034c0 6.938-2.312 9.25-9.25 9.25s-9.25-2.312-9.25-9.25 2.313-9.25 9.25-9.25a20.931 20.931 0 012.983.187" />
      </g>
    </svg>
  );
};

export const ProductFeatures: React.FC<IconProps> = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 24 24"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M18 10V6h-4M6 14v4h4"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};
