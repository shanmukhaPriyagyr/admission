const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Patient = require('./Patient');

const IpdPatients = sequelize.define('IpdPatients', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    admission_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    discharge_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    diagnosis: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    admission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    patient_mrn: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    case_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    acknowledged_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    acknowledged_nurse_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    acknowledged_nurse_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Admitted', 'Discharged', 'Bed Allocated', 'Transferred To OT', 'Bed Deallocated'),
        allowNull: false,
    },
    ot_acknowledgement: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
}, {
    tableName: 'ipd_patients',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['case_id'],
        },
    ],
});

IpdPatients.belongsTo(Patient, {
    foreignKey: 'patient_mrn',
    targetKey: 'mrn',
    as: 'patient',
});

module.exports = IpdPatients;