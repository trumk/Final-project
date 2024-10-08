import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import "./SearchSortFilter.css"
import { searchProjects, sortProjects, filterProjects } from '../redux/apiRequest'; 

const SearchSortFilter = () => {
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');

  const handleSearch = () => {
    dispatch(searchProjects(searchTerm));
  };

  const handleSort = (e) => {
    setSortOption(e.target.value);
    dispatch(sortProjects(e.target.value));
  };

  const handleFilter = () => {
    dispatch(filterProjects(semester, department));
  };

  return (
    <div className="search-sort-filter">
      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by project or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {/* Sort */}
      <div className="sort-container">
        <select value={sortOption} onChange={handleSort} className="sort-select">
          <option value="">Sort by</option>
          <option value="likes">Most Likes</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Filter */}
      <div className="filter-container">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="filter-select"
        >
          <option value="">Filter by Semester</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="filter-select"
        >
          <option value="">Filter by Department</option>
          <option value="IT">IT</option>
          <option value="Marketing">Marketing</option>
          <option value="Design">Design</option>
          <option value="HR">HR</option>
        </select>

        <button onClick={handleFilter} className="filter-button">Filter</button>
      </div>
    </div>
  );
};

export default SearchSortFilter;
