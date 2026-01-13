import { useMemo, useState } from "react";
import { calculateHeatmapColor, calculatePercentageDiff } from "../assets/utils";
import { Filter, Eye, EyeOff, Lock, ArrowUp, ArrowDown } from 'lucide-react';
import { Paper, Button, Table } from '@mantine/core';

const DataTablePage = ({ data, headers }) => {
  const supplierColumns = headers.filter(h => h.toLowerCase().includes('supplier'));
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'none' });
  const [frozenColumns, setFrozenColumns] = useState([]);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showControls, setShowControls] = useState(false);
  
  const sortedData = useMemo(() => {
    if (!sortConfig.column || sortConfig.direction === 'none') return data;
    return [...data].sort((a, b) => {
      const aVal = parseFloat(a[sortConfig.column]) || a[sortConfig.column];
      const bVal = parseFloat(b[sortConfig.column]) || b[sortConfig.column];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === 'asc' 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortConfig]);
  
  const heatmapData = useMemo(() => {
    return sortedData.map(row => {
      const rates = supplierColumns.map(col => parseFloat(row[col])).filter(v => !isNaN(v));
      return rates.length ? { min: Math.min(...rates), max: Math.max(...rates) } : { min: 0, max: 0 };
    });
  }, [sortedData, supplierColumns]);
  
  const handleSort = (column) => {
    setSortConfig(prev => {
      if (prev.column !== column) return { column, direction: 'asc' };
      if (prev.direction === 'asc') return { column, direction: 'desc' };
      return { column: null, direction: 'none' };
    });
  };
  
  const toggleFreeze = (index) => {
    setFrozenColumns(prev => prev.includes(index) ? [] : headers.slice(0, index + 1).map((_, i) => i));
  };
  
  const visibleColumns = headers.filter((_, i) => !hiddenColumns.includes(i));
  
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 mt-16 p-4">
      <Paper className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">BOM Analysis</h2>
            <p className="text-sm text-gray-600">{data.length} items</p>
          </div>
          <Button styles={{
          inner: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
          },
        }} leftSection={<Filter className="h-4 w-4" />} onClick={() => setShowControls(!showControls)}>
            {showControls ? 'Hide' : 'Show'} Controls
          </Button>
        </div>
        
        {showControls && (
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-semibold mb-2">Column Controls</h3>
            <div className="flex flex-wrap gap-2">
              {headers.map((header, i) => (
                <div key={i} className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm">
                  <span>{header}</span>
                  <Button onClick={() => toggleFreeze(i)} className={frozenColumns.includes(i) ? 'text-blue-600' : 'text-gray-400'} title="Freeze" unstyled>
                    <Lock className="h-3 w-3" />
                  </Button>
                  <Button onClick={() => setHiddenColumns(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])} className={hiddenColumns.includes(i) ? 'text-red-600' : 'text-gray-400'} title="Hide" unstyled>
                    {hiddenColumns.includes(i) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table className="w-full">
            <Table.Thead className="bg-gray-100 sticky top-0">
              <Table.Tr>
                {visibleColumns.map((header, i) => {
                  const origIdx = headers.indexOf(header);
                  const isFrozen = frozenColumns.includes(origIdx);
                  return (
                    <Table.Th key={i} className={`px-4 py-3 text-left text-xs font-semibold uppercase ${isFrozen ? 'sticky left-0 bg-gray-100 z-20' : ''}`}>
                      <Button onClick={() => handleSort(header)} className="flex items-center gap-1" unstyled>
                        {header}
                        {sortConfig.column === header && (sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                      </Button>
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedData.map((row, rowIdx) => (
                <Table.Tr key={rowIdx} className="border-b hover:bg-gray-50">
                  {visibleColumns.map((header, colIdx) => {
                    const origIdx = headers.indexOf(header);
                    const isFrozen = frozenColumns.includes(origIdx);
                    const isSupplier = supplierColumns.includes(header);
                    const rate = parseFloat(row[header]);
                    
                    let style = {};
                    if (isFrozen) style.left = '0px';
                    if (isSupplier && !isNaN(rate)) {
                      const { min, max } = heatmapData[rowIdx];
                      style.backgroundColor = calculateHeatmapColor(rate, min, max);
                    }
                    
                    return (
                      <Table.Td key={colIdx} className={`px-4 py-2 text-sm ${isFrozen ? 'sticky z-10 bg-white' : ''}`} style={style}>
                        {isSupplier && !isNaN(rate) ? (
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">{rate.toFixed(2)}</span>
                            <span className="text-xs opacity-80">{calculatePercentageDiff(rate, parseFloat(row['Estimated Rate']))}</span>
                          </div>
                        ) : row[header] || '-'}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </Paper>
    </div>
  );
};

export default DataTablePage;