const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const OTPVerification = sequelize.define('OTPVerification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    mobileNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'otp_verifications',
    timestamps: true,
});

module.exports = OTPVerification;
