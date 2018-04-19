// jshint esversion: 6
/**
 * Se importan los modulos con la configuración del sistema, y acceso a base de datos
 */
const dbConfig   = require('../config/dbConfig');
const config     = require('../config/config');
const sequelize = dbConfig.sequelize;

/**
 * Se importa modulo de carga masiva inicial de datos.
 */
const dataLoader = require('../data/dataLoader');

/**
 * Se importan los objetos del Modelo.
 * Si el modelo llegara a ser muy grande esto se puede "automatizar" utilizando una función
 * que haga require de cada objeto asociado a una tabla (excluyendo archivos index.js,
 * README.md y *service.js)
 */
const Company = require('./Company');

// Exporta la funcion para inicalizar el modelo de base de datos
module.exports = () => {
    // Valida que sea posible establecer la conexión con la BD
    sequelize.authenticate()
        .then(() => {
            console.log('DB connection established!');
            /**
             * Inicializa la base de datos conforme a las definiciones de
             * los objetos del Modelo. Si las tablas no existen las va a crear, sino no va a hacer nada.
             * Puede forzar la creación desde cero (CON PÉRDIDA DE DATOS), y la
             * modificación del modelo si es necesario (siempre que no haya información
             * en las tablas a alterar).
             * El parametro logging indica que durante la sincronizacion los mensajes y errores relativos
             * a la base de datos los va a lanzar usando el comando console.log
             */
            sequelize.sync({
                force: config.DB_RECREATE || false,
                logging: console.log,
                alter: true
            }).then(() => {
                console.log('All tables synced');

                /**
                 * La carga inicial de datos se realizará cuando se ahya termiando de
                 * sincronizar el modelo. Esta carga debiera estar condicionada por una variable
                 * de ambiente o de configuracion
                 */
                dataLoader();
            }).catch((error) => {
                console.error('ERROR syncing tables: ', error);
            });
        });
};

