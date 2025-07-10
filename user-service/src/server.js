const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db.js');
dotenv.config();
connectDB(); // Connect to MongoDB
app.use(express.json());
app.use(cors());

//routes
const userRoutes = require('./routes/authRoutes');
app.use('/api/users', userRoutes);

module.exports=app;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
