/* eslint-disable @typescript-eslint/no-require-imports */

export interface ProductFeature {
  id: number;
  title: string;
  animationData: string;
  desc: string;
  url: string;
}

export interface AppFeature {
  id: number;
  title: string;
  content: string;
  url: string;
}

export const FeaturesProduct: ProductFeature[] = [
  {
    id: 1,
    title: "Advanced Sensor Technology",
    animationData: require("/public/ProductFeatures/sensor.json"),
    desc: "The GreenThumb utilizes cutting-edge sensor technology to gather crucial data on your garden's environment. This includes light, pH levels, conductivity, temperature, moisture, and connectivity, ensuring precise data collection for optimal plant health.",
    url: "tip/advanced-sensor-technology-revolutionizing-gardening-with-greenthumb",
  },
  {
    id: 2,
    title: "Intelligent Data Analysis",
    animationData: require("/public/ProductFeatures/analysis.json"),
    desc: "The GreenThumb analyzes collected data using advanced AI algorithms, providing actionable insights and personalized gardening recommendations. This intelligent analysis helps prevent plant deaths and improves overall gardening efficiency.",
    url: "tip/intelligent-data-analysis-with-greenthumb-revolutionizing-your-gardening-experience",
  },
  {
    id: 3,
    title: "Plant Ranking",
    animationData: require("/public/ProductFeatures/ranking.json"),
    desc: "The GreenThumb ranks plants based on their likelihood to thrive in current conditions, considering symbiotic relationships with nearby plants. This feature promotes the creation of food forests and enhances plant compatibility in your garden.",
    url: "tip/plant-ranking-a-greenthumb-game-changer-for-your-garden",
  },
  {
    id: 4,
    title: "Comprehensive Gardening Solution",
    animationData: require("/public/ProductFeatures/plant.json"),
    desc: "The GreenThumb combines a user-friendly sensor stick and an intuitive app to provide a complete gardening solution. From real-time data collection to intelligent recommendations, it simplifies and enhances the gardening experience.",
    url: "tip/comprehensive-gardening-solution-transform-your-gardening-with-greenthumb",
  },
];

export const FeaturesApp: AppFeature[] = [
  {
    id: 1,
    title: "Assistant and Daily Summary",
    content:
      "The GreenThumb app includes an AI Chat feature that enhances user interaction and garden management. Each day, the AI Chat provides a summary of your garden's status, detailing the health of your plants and any immediate actions required. This feature ensures that you are always informed about the state of your garden, making it easier to manage and maintain.",
    url: "tip/assistant-and-daily-summary-your-ai-chat-assistant-for-garden-updates-and-daily-summaries",
  },
  {
    id: 2,
    title: "Garden Schedule in Calendar View",
    content:
      "The GreenThumb app's calendar view is an essential tool for organizing and managing your garden maintenance tasks. This feature allows you to schedule and track upcoming activities, ensuring that you stay on top of important gardening tasks. Whether it's watering, fertilizing, or pruning, the calendar view helps you plan your gardening activities efficiently.",
    url: "tip/garden-schedule-in-calendar-view-plan-and-track-your-gardening-tasks-with-ease",
  },
  {
    id: 3,
    title: "Detailed Sensor Data",
    content:
      "The GreenThumb app provides detailed presentations of sensor data collected throughout the day, offering a comprehensive view of your garden's environmental conditions. Graphical views help users visualize changes in their garden environment, making it easier to identify patterns and respond proactively.",
    url: "tip/detailed-sensor-data-and-graphical-views",
  },
];
