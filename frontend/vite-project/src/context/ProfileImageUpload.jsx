import React, { useState, useRef } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ProfileImageUpload = ({ avatar, setAvatar }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setAvatar(null);
    setPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[--color-text-secondary] mb-1.5">
        Profile Avatar
      </label>
      
      <div 
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full h-32 rounded-[--radius-standard] border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 ${
          isDragging 
            ? 'border-[--color-accent-blue] bg-[--color-accent-blue]/10' 
            : preview 
              ? 'border-transparent bg-[--color-bg-elevated]' 
              : 'border-[--color-border-bright] hover:border-[--color-text-secondary] bg-[--color-bg-elevated]'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 w-full h-full group"
            >
              <img 
                src={preview} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium mb-2">Change Image</p>
                <button
                  type="button"
                  onClick={clearImage}
                  className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                  title="Remove image"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-4 text-center pointer-events-none"
            >
              <div className={`p-3 rounded-full mb-2 transition-colors ${isDragging ? 'bg-[--color-accent-blue]/20 text-[--color-accent-blue]' : 'bg-[--color-bg-card] text-[--color-text-muted]'}`}>
                <FiUploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm text-[--color-text-secondary] font-medium">
                <span className="text-[--color-accent-blue]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-[--color-text-muted] mt-1">
                SVG, PNG, JPG or GIF (max. 5MB)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileImageUpload;