export function isEmpty(value: any): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return value === "" || value === null || value === undefined;
}

export const getOptimizedImageUrl = (url: string, width: number = 400) => {
  if (url && url.includes("res.cloudinary.com")) {
    // Inserts optimization params (w_{width}, f_auto, q_auto)
    return url.replace("/upload/", `/upload/w_${width},f_auto,q_auto/`);
  }
  return url;
};