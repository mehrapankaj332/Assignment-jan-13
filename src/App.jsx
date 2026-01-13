import React, { useState } from 'react';
import { FileSpreadsheet, Network } from 'lucide-react';
import { Button, Paper } from '@mantine/core';
import TreeTable from './components/TreeTable';
import DataTablePage from './components/DataTable';
import { p2Data } from './assets/constant';
import FileUploadPage from './components/FileUploadPage';
import HomeButton from './components/atoms/HomeButton';


const App = () => {
  const [page, setPage] = useState('home');
  const [p1Data, setP1Data] = useState(null);
  const [p1Headers, setP1Headers] = useState(null);
  
  if (page === 'home') {
    return (
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">BOM Assignment</h1>
            <p className="text-gray-600">Advanced table features & hierarchical data visualization</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Paper className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <FileSpreadsheet className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-xl font-bold mb-2">Problem 1: BOM Heatmap</h2>
              <p className="text-sm text-gray-600 mb-4">CSV upload with dynamic heatmaps, column freeze, sort, hide, and percentage analysis.</p>
              <Button onClick={() => setPage('p1-upload')} className="w-full px-4 py-2 bg-indigo-600 text-black rounded hover:bg-indigo-700">
                Start Problem 1
              </Button>
            </Paper>
            
            <Paper className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <Network className="h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-xl font-bold mb-2">Problem 2: Tree Table</h2>
              <p className="text-sm text-gray-600 mb-4">Hierarchical tree table with expandable/collapsible nodes and multi-level categories.</p>
              <Button onClick={() => setPage('p2')} className="w-full px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700">
                Start Problem 2
              </Button>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
  
  if (page === 'p1-upload') {
    return (
      <>
        <FileUploadPage onDataLoaded={(data, headers) => { setP1Data(data); setP1Headers(headers); setPage('p1-table'); }} />
         <HomeButton onClick={() => setPage('home')} />
      </>
    );
  }
  
  if (page === 'p1-table' && p1Data) {
    return (
      <>
        <DataTablePage data={p1Data} headers={p1Headers} />
         <HomeButton onClick={() => setPage('home')} />
      </>
    );
  }
  
  if (page === 'p2') {
    return (
      <>
        <TreeTable data={p2Data} />
        <HomeButton onClick={() => setPage('home')} />
      </>
    );
  }
  
  return null;
};

export default App;