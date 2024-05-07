import React, { useState } from "react";

const Paginations = ({
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (argu: any) => void;
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return <div className="pagination">{renderPagination()}</div>;
};

export default Paginations;
