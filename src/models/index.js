const sequelize = require('../../config/database');
const Bed = require('./Bed');
const BedAllocations = require('./BedAllocations');
const BedGroup = require('./BedGroup');
const BedType = require('./BedType');
const Blocks = require('./Blocks');
const EmergencyContact = require('./EmergencyContact');
const Floor = require('./Floor');
const Insurance = require('./Insurance');
const IPDPatient = require('./IPDPatient');
const Patient = require('./Patient');
const Ward = require('./Ward');

const BabyDetail = require('./BabyDetail');
const OTPVerification = require('./OtpVerification');
const AbhaLinkToken = require('./AbhaLinkToken');
// Synchronize all models with the database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Use `alter` for development, remove in production
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
};

// Run sync if this file is executed directly
if (require.main === module) {
  syncDatabase().catch((error) => {
    console.error("Failed to sync database:", error);
  });
}

// Export models, Sequelize instance, and sync function
module.exports = {
  Bed,
  BedAllocations,
  BedGroup,
  BedType,
  Blocks,
  EmergencyContact,
  Floor,
  Insurance,
  IPDPatient,
  Patient,
  Ward,
  BabyDetail,
  OTPVerification,
  AbhaLinkToken,
  sequelize,
  syncDatabase
};