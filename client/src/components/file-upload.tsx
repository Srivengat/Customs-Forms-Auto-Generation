import React, { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

export function FileUpload({ label, accept = ".pdf,.jpg,.jpeg,.png", onFileSelect, file }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full min-h-[160px] p-6 
          border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ease-in-out
          ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border bg-card hover:bg-secondary/30 hover:border-primary/50 hover:shadow-md'}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <FileText className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2 h-8 rounded-full border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="p-4 bg-secondary rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground"><span className="text-primary hover:underline">Click to upload</span> or drag and drop</p>
              <p className="text-xs mt-1">Accepts {accept.replace(/,/g, ', ')} (Max 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
