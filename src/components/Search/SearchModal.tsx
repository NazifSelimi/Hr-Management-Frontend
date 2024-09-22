import React, { useState } from "react";
import { Modal, Select, Input, Spin, message } from "antd";
import axiosInstance from "../../api/axiosInstance";
import Employees from "../Admin/Employees/Employees";
import Projects from "../Admin/Projects/Projects";
import DepartmentsList from "../Admin/Departments/DepartmentsList"; // Import Departments

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
          Departments: data.departments || [], // Add departments to results
        }[searchType] || [];

      setSearchResults(results); // Set the results here
      message.success("Search completed successfully.");
    } catch (error) {
      console.error("Error searching:", error);
      message.error("Failed to perform search.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTypeChange = (value: string) => {
    if (query.trim()) {
      setQuery("");
      setSearchResults([]); // Clear previous search results when search type changes
    }
    setSearchType(value);
  };

  const renderTable = () => {
    if (searchResults.length === 0) {
      return null; // Return nothing if no results
    }

    // Render the table based on searchType and results
    switch (searchType) {
      case "Employees":
        return <Employees data={searchResults} onClose={onClose} />;
      case "Projects":
        return <Projects data={searchResults} onClose={onClose} />;
      case "Departments":
        return <DepartmentsList data={searchResults} onClose={onClose} />;
      default:
        return null;
    }
  };

  // Reset the modal when it's closed
  const handleModalClose = () => {
    setSearchType("Employees"); // Reset to default
    setQuery(""); // Clear the query
    setSearchResults([]); // Clear the search results
    setLoading(false); // Stop any loading indicators
    onClose(); // Call the onClose prop to actually close the modal
  };

  return (
    <Modal
      title="Search"
      open={isOpen}
      onOk={handleSearch} // Search happens on clicking the 'Search' button
      onCancel={handleModalClose} // Reset and close the modal
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
        onPressEnter={handleSearch} // Search on pressing Enter
      />
      {loading ? (
        <Spin style={{ marginTop: 20 }} />
      ) : (
        renderTable() // Only render the table if there are search results
      )}
    </Modal>
  );
};

export default SearchModal;
