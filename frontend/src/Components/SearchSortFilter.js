import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./SearchSortFilter.css"
import { searchProjects, sortProjects, filterProjects, getAllProjects } from '../redux/apiRequest'; 

const SearchSortFilter = () => {
  const dispatch = useDispatch();
  const { allProjects, isFetching, error } = useSelector((state) => state.project);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        dispatch(searchProjects(searchTerm));
        setShowSuggestions(true);
      } else {
        dispatch(getAllProjects());
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    dispatch(filterProjects(semester, department));
  }, [semester, department, dispatch]);

  const handleSort = (e) => {
    setSortOption(e.target.value);
    dispatch(sortProjects(e.target.value));
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion); 
    setShowSuggestions(false); 
  };

  return (
    <div className="search-sort-filter">
     <div className="search-container">
        <input
          type="text"
          placeholder="Search by project or author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {showSuggestions && allProjects && allProjects.length > 0 && (
          <ul className="suggestions-list">
            {allProjects.map((suggestion, index) => (
              <li 
                key={index}
                onClick={() => handleSuggestionClick(suggestion.name)} 
                className="suggestion-item"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
        {isFetching && <p>Loading...</p>}
        {error && <p>Error loading projects.</p>}
      </div>

      <div className="sort-container">
        <select value={sortOption} onChange={handleSort} className="sort-select">
          <option value="">Sort by</option>
          <option value="likes">Most Likes</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

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
