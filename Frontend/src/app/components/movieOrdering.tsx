import React from "react";

export interface MovieOrderingProps {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: string;
  setSortOrder: (sortOrder: string) => void;
}

export default function MovieOrdering({ sortBy, setSortBy, sortOrder, setSortOrder }: MovieOrderingProps) {
    return (
        <>
          <div className="col-6">
            <label htmlFor="sortOrder" className="form-label">Sort order</label>
            <select id="sortOrder" className="form-select" value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}>
              <option value="Descending">Descending</option>
              <option value="Ascending">Ascending</option>
            </select>
          </div>
          <div className="col-6">
          <label htmlFor="sortBy" className="form-label">Sort by</label>
            <select id="sortBy" className="form-select" value={sortBy}
                    onChange={e => setSortBy(e.target.value)}>
              <option value="Popularity">Popularity</option>
              <option value="Title">Title</option>
              <option value="AverageReviewScore">Average score</option>
              <option value="MinimumAge">Minimum age</option>
              <option value="ReleaseDate">Release date</option>
            </select>
          </div>
        </>
    )
}
