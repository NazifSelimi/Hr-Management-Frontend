import React from "react";
import { Table } from "antd";

interface CustomTableProps<T> {
  columns: any[];
  dataSource: T[];
  loading: boolean;
  rowKey: string;
  scroll?: { x: number; y: number };
}

const CustomTable = <T extends object>({
  columns,
  dataSource,
  loading,
  rowKey,
  scroll = { x: 1000, y: 500 }, // Default scroll values, can be customized
}: CustomTableProps<T>) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      rowKey={rowKey}
      scroll={scroll}
      pagination={false} // Add pagination if needed
    />
  );
};

export default CustomTable;
