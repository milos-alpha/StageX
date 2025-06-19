import { useState } from 'react';

const FileUpload = ({ accept, onFileChange, label, buttonClass = '' }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center">
        <label
          className={`${buttonClass} cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
        >
          Choose File
          <input
            type="file"
            className="sr-only"
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
        <span className="ml-2 text-sm text-gray-500">
          {fileName || 'No file chosen'}
        </span>
      </div>
    </div>
  );
};

export default FileUpload;