
import { toast } from "sonner";

// Base URL for the backend API. Removes any trailing slash to avoid
// double slashes when concatenating paths.
export const API_URL = (
  import.meta.env.VITE_API_URL || "https://be-capernam.fly.dev/"
).replace(/\/+$/, "");

/**
 * Generic function to fetch data from an API
 */
export async function fetchFromApi<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  const fullUrl = url.startsWith('http')
    ? url
    : `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  try {
    const response = await fetch(fullUrl, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error("API fetch error:", error);
    toast.error("Failed to fetch data. Please try again.");
    return null;
  }
}
