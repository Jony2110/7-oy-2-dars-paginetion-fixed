import  { useState, useEffect } from 'react';

const PaginationComponent = () => {
  const [machines, setMachines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);   // Состояние для следующей страницы
  const [prevPage, setPrevPage] = useState(null);   // Состояние для предыдущей страницы
  const limit = 12;

  useEffect(() => {
    fetchMachines(currentPage);
  }, [currentPage]);

  const fetchMachines = async (page) => {
    try {
      const response = await fetch(`http://localhost:3000/machines?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setMachines(data.results || []); // Используем data.results вместо data.machines
      setTotalPages(Math.ceil(data.total / limit));
      setNextPage(data.next ? data.next.page : null);  // Устанавливаем следующую страницу
      setPrevPage(data.previous ? data.previous.page : null);  // Устанавливаем предыдущую страницу
      setError(null);
    } catch (error) {
      console.error("Failed to fetch machines:", error);
      setError(error.message);
      setMachines([]);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container border-spacing-2 mx-auto p-4">
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
       
      <div className="grid grid-cols-3 gap-4">
        {machines.length > 0 ? (
          machines.map(machine => (
            <div key={machine.title} className="border p-4 rounded shadow">
              <img src={machine.image} alt={machine.title} className="w-full h-48 object-cover rounded mb-2" />
              <h2 className="text-lg font-semibold">{machine.title}</h2>
              <p>{machine.class}</p>
            </div>
          ))
        ) : (
          !error && <p className="col-span-3 text-center">No machines available.</p>
        )}
      </div>

      <div className="container mx-auto flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(prevPage)}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
          disabled={!prevPage}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(nextPage)}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700"
          disabled={!nextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
