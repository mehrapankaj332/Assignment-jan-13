import { useMemo, useState } from "react";
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Paper, Button, Table } from '@mantine/core';


const TreeTable = ({ data }) => {
  const [expanded, setExpanded] = useState(new Set());
  
  const tree = useMemo(() => {
    const t = {};
    data.forEach(item => {
      const { Category, 'Sub Category 1': sub1, 'Sub Category 2': sub2, ...rest } = item;
      if (!t[Category]) t[Category] = {};
      if (!t[Category][sub1]) t[Category][sub1] = {};
      if (!t[Category][sub1][sub2]) t[Category][sub1][sub2] = [];
      t[Category][sub1][sub2].push(rest);
    });
    return t;
  }, [data]);
  
  const toggle = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  
  const renderRows = () => {
    const rows = [];
    const isExpandAll = expanded.has('all');
    
    Object.keys(tree).forEach(cat => {
      const catId = `c-${cat}`;
      const isCatExp = isExpandAll || expanded.has(catId);
      
      rows.push(
        <Table.Tr key={catId} className="bg-blue-50 border-b">
          <Table.Td className="px-4 py-2" style={{ paddingLeft: '16px' }}>
            <Button onClick={() => toggle(catId)} className="inline-flex items-center gap-2 font-bold" unstyled>
              {isCatExp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {cat}
            </Button>
          </Table.Td>
          <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
          <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
          <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
          <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
        </Table.Tr>
      );
      
      if (isCatExp) {
        Object.keys(tree[cat]).forEach(sub1 => {
          const sub1Id = `${catId}-${sub1}`;
          const isSub1Exp = isExpandAll || expanded.has(sub1Id);
          
          rows.push(
            <Table.Tr key={sub1Id} className="bg-green-50 border-b">
              <Table.Td className="px-4 py-2" style={{ paddingLeft: '40px' }}>
                <Button onClick={() => toggle(sub1Id)} className="inline-flex items-center gap-2 font-semibold" unstyled>
                  {isSub1Exp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  {sub1}
                </Button>
              </Table.Td>
              <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
              <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
              <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
              <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
            </Table.Tr>
          );
          
          if (isSub1Exp) {
            Object.keys(tree[cat][sub1]).forEach(sub2 => {
              const sub2Id = `${sub1Id}-${sub2}`;
              const isSub2Exp = isExpandAll || expanded.has(sub2Id);
              
              rows.push(
                <Table.Tr key={sub2Id} className="bg-yellow-50 border-b">
                  <Table.Td className="px-4 py-2" style={{ paddingLeft: '64px' }}>
                    <Button onClick={() => toggle(sub2Id)} className="inline-flex items-center gap-2 font-medium" unstyled>
                      {isSub2Exp ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      {sub2}
                    </Button>
                  </Table.Td>
                  <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
                  <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
                  <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
                  <Table.Td className="px-4 py-2 text-gray-400">-</Table.Td>
                </Table.Tr>
              );
              
              if (isSub2Exp) {
                tree[cat][sub1][sub2].forEach((item, idx) => {
                  rows.push(
                    <Table.Tr key={`${sub2Id}-${idx}`} className="bg-white border-b hover:bg-gray-50">
                      <Table.Td className="px-4 py-2" style={{ paddingLeft: '88px' }}>{item['Item Code']}</Table.Td>
                      <Table.Td className="px-4 py-2 text-sm">{item['Item Code']}</Table.Td>
                      <Table.Td className="px-4 py-2 text-sm">{item.Description}</Table.Td>
                      <Table.Td className="px-4 py-2 text-sm text-right">{item.Quantity}</Table.Td>
                      <Table.Td className="px-4 py-2 text-sm text-right">{item.Rate}</Table.Td>
                    </Table.Tr>
                  );
                });
              }
            });
          }
        });
      }
    });
    
    return rows;
  };
  
  return (
    <div className="min-h-screen min-w-screen mt-16 bg-gray-50 p-4">
      <Paper className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Hierarchical Tree Table</h2>
            <p className="text-sm text-gray-600">{data.length} items</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setExpanded(new Set(['all']))} className="px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700 text-sm">
              Expand All
            </Button>
            <Button onClick={() => setExpanded(new Set())} className="px-4 py-2 bg-gray-600 text-black rounded hover:bg-gray-700 text-sm">
              Collapse All
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table className="w-full">
            <Table.Thead className="bg-gray-100">
              <Table.Tr>
                <Table.Th className="px-4 py-3 text-left text-xs font-semibold uppercase">Hierarchy</Table.Th>
                <Table.Th className="px-4 py-3 text-left text-xs font-semibold uppercase">Item Code</Table.Th>
                <Table.Th className="px-4 py-3 text-left text-xs font-semibold uppercase">Description</Table.Th>
                <Table.Th className="px-4 py-3 text-right text-xs font-semibold uppercase">Quantity</Table.Th>
                <Table.Th className="px-4 py-3 text-right text-xs font-semibold uppercase">Rate</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{renderRows()}</Table.Tbody>
          </Table>
        </div>
      </Paper>
    </div>
  );
};

export default TreeTable;;