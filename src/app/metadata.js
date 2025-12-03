import { getSiteSettings } from "@/lib/api";

// This function will be used by Next.js for dynamic metadata generation
export async function generateMetadata() {
  let siteName = "Dream Consultancy"; // Default site name
  const defaultTitle = `${siteName} - Your Future Starts Here`;
  const description = "Expert guidance for Nepali students aspiring to study in the UK. University selection, test preparation, visa assistance, and more.";

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
  title: "Dream Consultancy - Your Future Starts Here",
  description: "Expert guidance for Nepali students aspiring to study in the UK. University selection, test preparation, visa assistance, and more.",
}; 