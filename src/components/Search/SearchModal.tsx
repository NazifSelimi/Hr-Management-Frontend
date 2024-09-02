import React, { useState } from "react";
import { Modal, Select, Input, Spin, message } from "antd";
import axiosInstance from "../../api/axiosInstance";
import Employees from "../Employees/Employees";
import Projects from "../Projects/Projects";

// TODO APPLY THE SEARCH IN THE DEPARTMENTS ALSO...

const { Option } = Select;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState("Employees");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchType || !query.trim()) {
      message.warning("Please select a search type and enter a query.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/search", {
        searchType,
        query,
      });

      const results =
        {
          Employees: data.user || [],
          Projects: data.projects || [],
        }[searchType] || [];

      setSearchResults(results);

      message.success("Search completed successfully.");
    } catch (error) {
      console.error("Error searching:", error);
      message.error("Failed to perform search.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search type change and reset state if needed
  const handleSearchTypeChange = (value: string) => {
    if (query.trim()) {
      setQuery("");
      setSearchResults([]);
      // message.info("Search type changed, resetting query and results.");
    }
    setSearchType(value);
  };

  const renderTable = () => {
    switch (searchType) {
      case "Employees":
        return <Employees data={searchResults} onClose={onClose} />;
      case "Projects":
        return <Projects data={searchResults} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Search"
      open={isOpen}
      onOk={handleSearch}
      onCancel={onClose}
      okText="Search"
      width={800}
    >
      <Select
        value={searchType}
        style={{ width: "100%", marginBottom: 16 }}
        onChange={handleSearchTypeChange}
      >
        <Option value="Projects">Projects</Option>
        <Option value="Employees">Employees</Option>
        <Option value="Departments">Departments</Option>
      </Select>
      <Input
        placeholder="Enter your search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onPressEnter={handleSearch}
      />
      {loading ? <Spin style={{ marginTop: 20 }} /> : renderTable()}
    </Modal>
  );
};

export default SearchModal;
