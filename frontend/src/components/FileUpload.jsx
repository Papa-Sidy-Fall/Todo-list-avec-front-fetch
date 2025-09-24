import React, { useRef, useState } from 'react';

const FileUpload = ({
  accept,
  onFileSelect,
  preview,
  label,
  icon: Icon,
  className = '',
  multiple = false
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      if (multiple) {
        onFileSelect(files);
      } else {
        onFileSelect(files[0]);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(Array.from(e.target.files))}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-3">
            {preview.type.startsWith('image/') ? (
              <img
                src={preview.url}
                alt="Aperçu"
                className="w-20 h-20 object-cover rounded-lg mx-auto border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            )}
            <div className="text-sm text-gray-600">
              Cliquez pour changer ou glissez-déposez
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              {Icon ? (
                <Icon className="w-6 h-6 text-gray-400" />
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Cliquez pour sélectionner ou glissez-déposez
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {accept ? `Formats acceptés: ${accept}` : 'Tous les fichiers acceptés'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;