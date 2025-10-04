const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const resumeRoutes = require('./routes/resume');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/resumes', resumeRoutes);

app.get('/', (req, res) => res.send('AI Resume Builder API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
