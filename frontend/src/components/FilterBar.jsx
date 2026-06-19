import React from 'react';

const FilterBar = ({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }) => {
  return (
    <div className="filter-bar">
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
  );
};

export default FilterBar;