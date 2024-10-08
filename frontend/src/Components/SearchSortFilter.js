import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import "./SearchSortFilter.css"
import { searchProjects, sortProjects, filterProjects, getAllProjects } from '../redux/apiRequest'; 

const SearchSortFilter = () => {
  const dispatch = useDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');

  // Debounce để tránh gọi API quá nhiều lần khi gõ tìm kiếm
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        dispatch(searchProjects(searchTerm));
      } else {
        // Nếu searchTerm là rỗng, lấy tất cả các project
        dispatch(getAllProjects());
      }
    }, 300); // Gọi sau 300ms nếu không có thay đổi

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  // Tự động gọi API khi thay đổi lọc theo kỳ và khoa
  useEffect(() => {
    dispatch(filterProjects(semester, department));
  }, [semester, department, dispatch]);

  const handleSort = (e) => {
    setSortOption(e.target.value);
    dispatch(sortProjects(e.target.value));
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
      </div>
    </div>
  );
};

export default SearchSortFilter;
