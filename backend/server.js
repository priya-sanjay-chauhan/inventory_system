const express=require('express')
const mysql = require('mysql2');
const cors = require('cors');


const app=express()
app.use(cors());
app.use(express.json()); 


const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'db'
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});





const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})


// Get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  

// Add a new product
app.post('/products', (req, res) => {
    const { name, category, quantity, price, supplier } = req.body;

    
    if (!name) {
        return res.status(400).json({ message: 'Product Name is required.' });
    }
    if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
    }
    if (price < 0) {
        return res.status(400).json({ message: 'Price must be a non-negative number.' });
    }

    const sql = 'INSERT INTO products (name, category, quantity, price, supplier) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, category, quantity, price, supplier], (err) => {
        if (err) throw err;
        res.json({ message: 'Product added' });
    });
});

// Update an existing product
app.put('/products/:id', (req, res) => {
    const { name, category, quantity, price, supplier } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Product Name is required.' });
    }
    if (quantity < 0) {
        return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
    }
    if (price < 0) {
        return res.status(400).json({ message: 'Price must be a non-negative number.' });
    }

    const sql = 'UPDATE products SET name = ?, category = ?, quantity = ?, price = ?, supplier = ? WHERE id = ?';
    db.query(sql, [name, category, quantity, price, supplier, req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: 'Product updated' });
    });
});


  
  // Delete a product
  app.delete('/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [req.params.id], (err) => {
      if (err) throw err;
      res.json({ message: 'Product deleted' });
    });
  });


  app.use(express.static('public')); // Serves files from the public directory

  