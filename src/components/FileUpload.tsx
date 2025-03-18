
import React, { useState, useRef } from 'react';
import { Upload, File, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isLoading) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isLoading) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      // Handle invalid file type
      console.error('Invalid file type. Please upload an XML file.');
      setFileName(null);
    }
  };

  const handleClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={cn(
        "w-full transition-all duration-300 animate-fade-in",
        "rounded-lg border border-dashed p-8",
        isDragging ? "border-primary bg-primary/5" : "border-border",
        isLoading ? "opacity-50 pointer-events-none" : "cursor-pointer"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xml,.docx"
        className="hidden" 
      />
      
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
          <Plus className="w-7 h-7 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {fileName ? fileName : 'Upload OOXML Document'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {fileName
              ? 'Click to change file'
              : 'Drag and drop your file here, or click to browse'}
          </p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Browse Files
        </Button>

        <p className="text-xs text-muted-foreground mt-4">
          Supported formats: OOXML (.xml), Word Document (.docx)
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
