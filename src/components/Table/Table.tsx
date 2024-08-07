import React from "react";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table"; // This is used to type the columns accurately.

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface TableComponentProps {
  columns: ColumnsType<DataType>;
  data: DataType[];
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => (
  <Table columns={columns} dataSource={data} />
);

export default TableComponent;
