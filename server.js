const express = require('express');
const db = require('./config/database'); // Import the database connection
const Patient = require('./src/models/Patient');
const EmergencyContact = require('./src/models/EmergencyContact');
const Insurance = require('./src/models/Insurance');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors'); // Import the cors middleware

const patientRoutes = require('./src/routes/patientRoutes');
const bedRoutes = require('./src/routes/bedRoutes');
const otpRoutes = require('./src/routes/otpRoutes');
const hiecmRoutes = require('./src/routes/hiecmRoutes');
const errorHandler = require('./src/middlewares/errorHandler');

// Define relationships
Patient.hasMany(EmergencyContact, { foreignKey: 'patient_id' });
EmergencyContact.belongsTo(Patient, { foreignKey: 'patient_id' });

Patient.hasMany(Insurance, { foreignKey: 'patient_id' });
Insurance.belongsTo(Patient, { foreignKey: 'patient_id' });

// Test the database connection
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error connecting to the database:', err));

app.use(cors()); // Enable CORS for all routes
// Middleware to parse JSON
app.use(express.json());

// Use patient routes
app.use('/api', patientRoutes);
app.use('/api', bedRoutes);
app.use('/api', otpRoutes);
app.use('/api/hiecm', hiecmRoutes);

// Centralized error handling middleware
app.use(errorHandler);

app.get('/', (req, res) => {
    return res.status(200).send('Welcome to RxDxStreamLine Admission Backend server');
});
  
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
