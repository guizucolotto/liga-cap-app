
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { readCSVFile } from "@/utils/csvUtils";

interface CSVUploaderProps {
  onCSVLoaded: (data: string) => void;
  accept?: string;
  buttonText?: string;
}

const CSVUploader = ({ 
  onCSVLoaded, 
  accept = ".csv", 
  buttonText = "Upload CSV" 
}: CSVUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const csvData = await readCSVFile(file);
      onCSVLoaded(csvData);
      toast.success(`File "${file.name}" loaded successfully`);
    } catch (error) {
      console.error("Error reading CSV file:", error);
      toast.error("Failed to read CSV file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="max-w-sm"
        disabled={isLoading}
      />
      <Button disabled={isLoading} variant="outline">
        {isLoading ? "Loading..." : buttonText}
      </Button>
    </div>
  );
};

export default CSVUploader;
