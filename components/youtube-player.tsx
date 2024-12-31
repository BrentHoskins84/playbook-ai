"use client";

import { useEffect, useState } from "react";

interface YoutubePlayerProps {
  url: string;
  className?: string;
  title?: string;
}

export default function YoutubePlayer({
  url,
  className = "",
  title = "YouTube video player",
}: YoutubePlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("");

  useEffect(() => {
    // Extract video ID from various YouTube URL formats
    const getYoutubeVideoId = (url: string): string | null => {
      // Handle standard watch URLs
      const watchUrlMatch = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      );
      if (watchUrlMatch) return watchUrlMatch[1];

      // Handle embed URLs
      const embedUrlMatch = url.match(/youtube\.com\/embed\/([^&\n?#]+)/);
      if (embedUrlMatch) return embedUrlMatch[1];

      return null;
    };

    const videoId = getYoutubeVideoId(url);
    if (videoId) {
      // Create proper embed URL with additional parameters for better security
      setEmbedUrl(
        `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
      );
    }
  }, [url]);

  if (!embedUrl) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full pt-[56.25%] ${className}`}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg z-40"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
