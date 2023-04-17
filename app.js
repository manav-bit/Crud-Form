const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const cors=require('cors');
require('dotenv').config();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});
// Create a connection to the MySQL database
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});
connection.getConnection((error, connection) => {
  if (error) {
      console.error('Error connecting to MySQL database:', error);
  } else {
      console.log('Connected to MySQL database successfully!');
      connection.release();
  }
});

//define api for rendering page 
app.get('/',(req,res)=>{
  res.sendFile("/public/main.html",{root:__dirname});
})

// Define the API endpoint for fetching paginated data
app.get('/employees/:page', (req, res) => {
  const page = parseInt(req.params.page);
  const limit = 10;
  const offset = (page - 1) * limit;

  // Build the SQL query for fetching the paginated data
  const query = `
    SELECT * FROM employees
    LIMIT ${limit} OFFSET ${offset}
  `;

  // Execute the query and return the results
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      // Get the total count of rows in the table
      connection.query('SELECT COUNT(*) as count FROM employees', (error, totalCount) => {
        if (error) {
          res.status(500).send(error);
        } else {
          const total = totalCount[0].count;
          const totalPages = Math.ceil(total / limit);

          // Return the paginated data and pagination metadata
          res.json({
            data: results,
            currentPage: page,
            totalPages: totalPages
          });
        }
      });
    }
  });
});

// Create an employee
app.post('/employee', (req, res) => {
  const employees = req.body;
  // console.log(employees);
  const sql = 'INSERT INTO employees (name, address,phone,jobtitle,email,pname,pnumber,prelation,sname,snumber,srelation) VALUES (?, ?,?,?,?,?,?,?,?,?,?)';
  connection.query(sql, [employees.name, employees.address,employees.phone, employees.jobtitle, employees.email, employees.pname, employees.pnumber, employees.prelation, employees.sname, employees.snumber,  employees.srelation], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'An error occurred while creating the employee' });
    }
    // const eid = result.insertId;
    // console.log(employees);
    
    
    res.status(201).json({ message: 'Employee created successfully' });
  });
});

app.patch('/employee/update',(req,res)=>{
  console.log(req.body);
  let updatevalue=req.body;
  const sql = 'UPDATE employees SET address = ?, phone = ?, jobtitle = ?, pname = ?, pnumber = ?, prelation = ?, sname = ?, snumber = ?, srelation = ? WHERE email = ?';
  connection.query(sql, [ updatevalue.address,updatevalue.phone, updatevalue.jobtitle,  updatevalue.pname, updatevalue.pnumber, updatevalue.prelation, updatevalue.sname, updatevalue.snumber,  updatevalue.srelation,updatevalue.email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'An error occurred while updating the employee' });
    }
    // const eid = result.insertId;
   
    
    
    res.status(201).json({ message: 'Employee updated successfully' });
})
})

app.delete('/employee/delete', (req, res) => {
  const employee = req.body;
  const sql = 'DELETE FROM employees WHERE eid = ?';
  connection.query(sql, [employee.eid], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'An error occurred while deleting the employee' });
    } else {
      console.log('Employee deleted successfully');
      res.status(201).json({ message: 'Employee deleted successfully' });
    }
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
