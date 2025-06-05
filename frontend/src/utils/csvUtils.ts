
/**
 * Parse CSV string data into an array of objects
 * @param csvString The CSV data as a string
 * @param headers Optional array of header names (if not provided, first row is used)
 */
export function parseCSV<T extends Record<string, any>>(
  csvString: string, 
  headers?: string[]
): T[] {
  if (!csvString) return [];
  
  const lines = csvString.trim().split("\n");
  if (lines.length === 0) return [];
  
  const headerRow = headers || lines[0].split(",").map(h => h.trim());
  const dataRows = headers ? lines : lines.slice(1);
  
  return dataRows.map(row => {
    const values = row.split(",").map(val => val.trim());
    const obj: Record<string, any> = {};
    
    headerRow.forEach((header, index) => {
      // Try to convert to number if possible
      const value = values[index];
      obj[header] = !isNaN(Number(value)) ? Number(value) : value;
    });
    
    return obj as T;
  });
}

/**
 * Load CSV file from a URL or file input
 */
export async function loadCSVFromUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("CSV loading error:", error);
    return null;
  }
}

/**
 * Read a CSV file from file input
 */
export function readCSVFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
