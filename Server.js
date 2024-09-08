const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./Config/mongoConnections'); // Connection and collection management
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/article');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes for authentication and articles
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);




const LOCAL_IP = '192.168.1.x'; 


app.listen(3000, () => {
  console.log("Your server is running at http://localhost:3000");
});

// app.listen(3000, () => {
//   console.log(`Your server is running at http://${LOCAL_IP}:3000`);
// });