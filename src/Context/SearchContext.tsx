import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  searchType: string;
  setSearchType: (type: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  clearSearch: () => void; // Function to clear the search state
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchType, setSearchType] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const clearSearch = () => {
    setSearchType("");
    setSearchResults([]);
  };

  return (
    <SearchContext.Provider
      value={{
        searchType,
        setSearchType,
        searchResults,
        setSearchResults,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
