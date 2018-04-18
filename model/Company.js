// jshint esversion: 6
/**
 * Archivo de definición de modelo para objeto Company
 * Si se utiliza un ORM, como por ejemplo Sequelize, se debe definir el objeto para
 * trabajar contra la base de datos.
 * La estructura de este objeto debe ser análoga a la estructura de la tabla asociada en
 * la Base de Datos.
 *
 * Para el caso de Sequelize, la base de datos puede ser definida y modificada en función
 * de estas definiciones.
 * La idea de esto es poder tener definiciones consistentes para un modelo de datos,
 * independiente del motor que se esté utilizando. Se recomienda referirse a la documentación
 * de Sequelize y mirar la estructura de las tablas generadas durante la sincronización.
 */
const Sequelize = require('../config/dbConfig').Sequelize;
const sequelize = require('../config/dbConfig').sequelize;

const Company = sequelize.define('company',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'cmp_name'
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: 'cmp_email',
            validate: {
                isEmail: true
            }
        },
        employees: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
    {
        timestamps: true,
        freezeTableName:true,
        paranoid: true
    }
);

exports.Company = Company;
