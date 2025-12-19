import { useState } from "react";

import { useEffect } from "react";

function MediaProgressBar({
  isMediaUploading,
  progress,
}: {
  isMediaUploading: boolean;
  progress: number;
}) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
        setAnimatedProgress(0);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;

  return (
    <div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {isMediaUploading && (
          <div
            className="h-2 bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: isMediaUploading ? `${animatedProgress}%` : "0%" }}
          >
            {progress >= 100 && isMediaUploading && (
              <div className="h-2 bg-blue-700 absolute top-0 bottom-0 left-0 right-0 animate-pulse transition-opacity duration-500 ease-in-out"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaProgressBar;
