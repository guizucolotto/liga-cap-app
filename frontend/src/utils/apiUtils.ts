
import { toast } from "sonner";

/**
 * Generic function to fetch data from an API
 */
export async function fetchFromApi<T>(url: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(url, options);
    
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
