import { useState } from "react";
import { Upload } from 'lucide-react';
import { Paper } from '@mantine/core';

const FileUploadPage = ({ onDataLoaded }) => {
  const [error, setError] = useState('');
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, i) => { row[header] = values[i] || ''; });
          return row;
        });
        onDataLoaded(data, headers);
      } catch (err) {
        setError(err, 'Error parsing CSV file');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="min-h-screen min-w-screen border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Paper className="bg-white rounded-lg shadow-xl p-8 max-w-4xl">
        <Upload className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Upload BOM CSV</h2>
        <p className="text-center text-gray-600 mb-6">Upload your Bill of Materials file</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
          <label htmlFor="csv-upload" className="cursor-pointer text-gray-600">
            Click to upload CSV file
          </label>
        </div>
        
        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
        
        <div className="mt-4 text-xs text-gray-500">
          <p className="font-semibold">Expected: Item Code, Material, Quantity, Estimated Rate, Supplier 1-5</p>
        </div>
      </Paper>
    </div>
  );
};

export default FileUploadPage;