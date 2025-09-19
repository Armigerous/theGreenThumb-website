/**
 * Site metadata configuration.
 */
export interface SiteMetaData {
	title: string;
	author: string;
	headerTitle: string;
	description: string;
	language: string;
	theme: string;
	siteUrl: string;
	siteLogo: string;
	socialBanner: string;
	email: string;
	facebook: string;
	instagram: string;
	youtube: string;
	tiktok: string;
	locale: string;
}

const siteMetaData: SiteMetaData = {
	title: "GreenThumb helping North Carolina gardeners", // Site title
	author: "Eren Kahveci", // Author name
	headerTitle: "GreenThumb Official Website", // Header title
	description: "A website to help North Carolina Gardeners", // Site description
	language: "en-us", // Site language
	theme: "system", // Theme preference: system, dark, or light
	siteUrl: "https://theofficialgreenthumb.com", // Site URL
	siteLogo: "/logo.png", // Path to the site logo
	socialBanner: "/Banner1920x1080.png", // Path to the social banner image
	email: "info@theofficialgreenthumb.com", // Contact email
	facebook: "https://www.facebook.com/people/The-GreenThumb/61558729280864/", // Facebook URL
	instagram: "https://www.instagram.com/theofficial_greenthumb/", // Instagram URL
	youtube: "https://www.youtube.com/@TheOfficialGreenThumb", // YouTube URL
	tiktok: "https://www.tiktok.com/@theofficialgreenthumb", // TikTok URL
	locale: "en-US", // Site locale
};

export default siteMetaData;