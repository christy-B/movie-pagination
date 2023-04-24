const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();

// MySQL database connection configuration
const dbConfig = {
  host: 'unixshell.hetic.glassworks.tech',
  user: 'student',
  password: 'Tk0Uc2o2mwqcnIA',
  database: 'sakila',
  port: 27116
};

const connection = mysql.createConnection(dbConfig);

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');
});

// Use the connection to perform database operations
app.get('/films', (req, res) => {
    const limit = req.query.limit || 10; // Limite de résultats par page
    const offset = req.query.offset || 0; // Offset de résultats
    let sortElement = req.query.order || 'title'; // Trie de résultat par défaut
    let sortDirection = req.query.sort || 'asc'; // Ordre de résultat par défaut
  
    // Si l'utilisateur a spécifié un tri, on l'utilise
    if (req.query.sortElement && req.query.sortDirection) {
      sortElement = req.query.sortElement;
      sortDirection = req.query.sortDirection;
    }
  
    // Récupération du nombre total de films
    const sqlCount = `SELECT COUNT(DISTINCT f.film_id) AS count
                      FROM film f
                      INNER JOIN film_category fc ON f.film_id = fc.film_id
                      INNER JOIN category c ON fc.category_id = c.category_id
                      INNER JOIN inventory i ON f.film_id = i.film_id
                      INNER JOIN rental r ON i.inventory_id = r.inventory_id;`;
  
    connection.query(sqlCount, (err, resultCount) => {
      if (err) throw err;
  
      const count = resultCount[0].count;
  
      // Récupération des films pour la page demandée
      const sql = `SELECT f.title AS title, f.rental_rate AS price, f.rating, c.name AS category, COUNT(r.rental_id) AS rental
                  FROM film f
                  INNER JOIN film_category fc ON f.film_id = fc.film_id
                  INNER JOIN category c ON fc.category_id = c.category_id
                  INNER JOIN inventory i ON f.film_id = i.film_id
                  INNER JOIN rental r ON i.inventory_id = r.inventory_id
                  GROUP BY f.title, f.rental_rate, f.rating, c.name
                  ORDER BY ${sortElement} ${sortDirection}
                  LIMIT ${limit} OFFSET ${offset};`;
  
      connection.query(sql, (err, result) => {
        if (err) throw err;
        const totalPages = Math.ceil(count / limit);
        res.set("X-Total-Count", count); // Envoi du nombre total de films dans l'en-tête
        res.set("X-Total-Pages", totalPages); // Envoi du nombre total de pages dans l'en-tête
        res.send(result);
      });
    });
  });
  

app.use(express.json());
app.use(express.static('client/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});


app.listen(PORT, () => {
  console.log(`le serveur est lancé sur le port : ${PORT}`);
});

