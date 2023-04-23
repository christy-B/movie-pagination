import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [films, setFilms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortElement, setSortElement] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    // Fonction pour récupérer les films depuis le backend
    async function fetchFilms() {
      const response = await axios.get(`/films?limit=${limit}&offset=${offset}&sortElement=${sortElement}&sortDirection=${sortDirection}`);
      setFilms(response.data);
      setTotalPages(parseInt(response.headers['x-total-pages']));
    }

    fetchFilms();
  }, [limit, offset, sortElement, sortDirection]);

  // Fonction pour gérer le changement de page
  function handlePageChange(page) {
    setCurrentPage(page);
    setOffset((page - 1) * limit);
  }
  function handleLimitChange(event) {
    setLimit(parseInt(event.target.value));
    setOffset(0);
  }
  //
  function handleSortChange(event) {
    const value = event.target.value;
    const [sortElement, sortDirection] = value.split('-');
    setSortElement(sortElement);
    setSortDirection(sortDirection);
  }
  // Création d'un tableau de boutons pour chaque page
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={currentPage === i ? 'active' : ''}
      >
        {i}
      </button>
    );
  }

  return (
    <div style={{padding: '25px'}} >
      <h1 style={{textAlign:'center'}}>Sakila Pagination </h1>
      <div style={{display:'flex', justifyContent:'space-around', padding:'25px 0px'}}>

        <div><span style={{fontWeight:'bold'}}>Page {Math.floor(offset / limit) + 1} of {totalPages}</span></div>

        <div>
          <label for="limit" style={{fontWeight:'bold', paddingRight:'5px'}}>page items</label>
          <select for="limit" value={limit} onChange={handleLimitChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <div>
          <label for="sort" style={{fontWeight:'bold', paddingRight:'5px'}}>sort</label>
          <select for="sort" value={`${sortElement}-${sortDirection}`} onChange={handleSortChange}>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="category-asc">Category (A-Z)</option>
            <option value="category-desc">Category (Z-A)</option>
            <option value="rental-desc">Rental (high to low)</option>
            <option value="rental-asc">Rental (low to high)</option>
          </select>
        </div>
        
      </div>
      <table style={{width:'100%', margin:'auto', textAlign:'left', padding:'25px 0px' }}>
        <thead style={{background: 'green'}}>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Category</th>
            <th>Rental</th>
          </tr>
        </thead>
        <tbody style={{background:'white'}}>
          {films.map(film => (
            <tr key={film.title}>
              <td>{film.title}</td>
              <td>{film.price}</td>
              <td>{film.rating}</td>
              <td>{film.category}</td>
              <td>{film.rental}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination" style={{ maxWidth: "100%" }}>
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
        {pages}
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}

export default App;