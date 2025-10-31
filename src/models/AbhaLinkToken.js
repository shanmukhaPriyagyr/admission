const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const AbhaLinkToken = sequelize.define('AbhaLinkToken', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    abha_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'abha_address'
    },
    link_token: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        field: 'link_token'
    },
    request_id: {
        type: DataTypes.STRING(191),
        allowNull: true,
        field: 'request_id'
    },
    source: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    raw_payload: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'raw_payload'
    }
}, {
    tableName: 'abha_link_tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

module.exports = AbhaLinkToken;
