import React from 'react';

const FilterBar = ({ 
  searchQuery, 
  setSearchQuery, 
  filterStatus, 
  setFilterStatus, 
  sortBy, 
  setSortBy, 
  dateFilter, 
  setDateFilter 
 }) => {
  return (
    <div className="filter-bar">
      <div className="filter-row-top">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="filter-buttons">
          {['All', 'Active', 'Inactive'].map(status => (
            <button 
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="filter-row-bottom">
        <div className="select-container">
          <label>Date Filter:</label>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="All">All Time</option>
            <option value="Today">Created Today</option>
            <option value="Week">Past Week</option>
          </select>
        </div>
        <div className="select-container">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;