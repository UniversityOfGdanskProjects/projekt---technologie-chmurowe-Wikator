import React from "react";

export interface paginatorProps {
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  totalPages: number;
}

export default function Paginator({ currentPage, setCurrentPage, totalPages }: paginatorProps) {
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    <span aria-hidden="true">&laquo;</span>
                </button>
                </li>
                {[...Array(totalPages)].map((_, i) =>
                  <li className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} key={i + 1}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                )}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                    <span aria-hidden="true">&raquo;</span>
                </button>
                </li>
            </ul>
        </nav>
    )
}
