export function isEmpty(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return value === "" || value === null || value === undefined;
}

export const getOptimizedImageUrl = (url: string, width: number = 400) => {
  try {
    if (!url) {
      return url;
    }

    const parsed = new URL(url);

    if (parsed.hostname === "res.cloudinary.com") {
      return url.replace("/upload/", `/upload/w_${width},f_auto,q_auto/`);
    }
  } catch (error) {
    console.error("Error optimizing image URL:", error);
  }
  return url;
};
