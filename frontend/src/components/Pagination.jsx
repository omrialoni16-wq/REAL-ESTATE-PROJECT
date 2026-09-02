import React from "react";

const Pagination = ({
  propertiesPerPage,
  totalProperties,
  paginate,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  if (totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className="pagination">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-link page-nav"
      >
        &laquo;
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="page-ellipsis">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={`page-link ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-link page-nav"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
