// jshint esversion: 6
const config = require('./config');
const Sequelize = require('sequelize');

/**
 * Se especifican los parametros para la conexión a la base de datos.
 * Aquí es posible apreciar algunas particularidades:
 * - Valores definidos como:
 *   atributo: config.PARAMETRO_CONFIGURACION || valor
 *   , lo que significa que de no existir el parametro en la configuración, utilizará
 *   el valor indicado
 * - Información de pool de conexiones: El pool de conexiones son conexiones que son reservadas
 *   y que ya se hicieron a la base de datos. Esto es para mejorar el rendimiento de las aplicaciones
 *   ya que establecer una conexión de base de datos es "caro". Un sistema de alta demanda no debiera
 *   requerir más de 10 conexiones, de ser así hay algo que está mal diseñado.
 */
const dbConfig = {
    'dialect':        'mysql',
    'host':           config.DB_SERVER || 'localhost',
    'port':           config.DB_PORT || 3306,
    'username':       config.DB_USER || 'root',
    'password':       config.DB_PWD || 'mysqlR00T',
    'database':       config.DB_DATABASE || 'api_starter',
    'timezone':       'America/Santiago',
    pool: {
        max:  3,
        min:  1,
        idle: 10000
    }
};

const sequelize = new Sequelize(dbConfig);

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};
