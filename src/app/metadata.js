import { getSiteSettings } from "@/lib/api";

// This function will be used by Next.js for dynamic metadata generation
export async function generateMetadata() {
  let siteName = "Dream Edge"; // Default site name
  const defaultTitle = `${siteName} - Study Abroad from Nepal`;
  const description = "Dream Edge: Professional education consultancy in Nepal. Expert guidance for studying abroad in Europe, Australia, New Zealand, USA, Canada, UK & Japan. Study abroad Nepal, overseas education consultancy, student visa assistance.";

  try {
    const apiResponse = await getSiteSettings();
    // Check if apiResponse is successful and data exists, then access site_name from apiResponse.data
    if (apiResponse && apiResponse.success && apiResponse.data && apiResponse.data.site_name) {
      siteName = apiResponse.data.site_name;
    }
  } catch (error) {
    console.error("Failed to load site settings for metadata:", error);
    // Use default siteName if settings fail to load
  }

  return {
    title: siteName ? `${siteName} - Your Future Starts Here` : defaultTitle,
    description: description,
    openGraph: {
      title: siteName ? `${siteName} - Your Future Starts Here` : defaultTitle,
      description: description,
      siteName: siteName || "Dream Consultancy",
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

// Default metadata export
export const metadata = {
  title: "Dream Edge - Study Abroad from Nepal",
  description: "Dream Edge: Professional education consultancy in Nepal. Expert guidance for studying abroad in Europe, Australia, New Zealand, USA, Canada, UK & Japan. Study abroad Nepal, overseas education consultancy, student visa assistance.",
}; 