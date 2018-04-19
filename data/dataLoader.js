// jshint esversion: 6
const config = require('../config/config');
/**
 * Se genera un objeto con la data inicial para nuestro modelo.
 * Tipicamente las claves irán cifradas de alguna manera y se debe
 * realizar una validación previa para determinar si se realizará
 * o no la carga inicial de datos.
 */
const initialData = {
    User: [
        {
            username: 'admin',
            password: 'admin123@',
            email: 'admin@admin.domain',
            profile: 'admin'
        },
        {
            username: 'user',
            password: 'user123@',
            email: 'user@user.domain',
            profile: 'user'
        }
    ],
    Profile: [
        {
            name: 'admin',
            description: 'Admin profile'
        },
        {
            name: 'user',
            description: 'User profile'
        }
    ],
    Company: [
        {
            name: 'Microsoft',
            address: 'Redmond, USA',
            email: 'bill.gates@microsoft.com',
            employees: 1500
        },
        {
            name: 'Google',
            address: 'Silicon Valley, USA',
            email: 'god@google.com',
            employees: 2500
        },
        {
            name: 'Apple',
            address: 'Silicon Valley, USA',
            email: 'steve.jobs@apple.com',
            employees: 3500
        }
    ]
};

/**
 * La carga inicial de datos utilizará las llaves del objeto de data inicial.
 * Cada llave corresponde a un objeto del modelo.
 * Si existen validaciones en el modelo, y se está intentando realizar la carga
 * de datos nuevamente, es probable que  aparezcan errores debido a las validaciones
 * del modelo (duplicidad de campos, u otros).
 */
module.exports = () => {
    const dataTables = Object.keys(initialData);
    if (config.FIRST_RUN) {
        dataTables.forEach(table => {
            try {
                // Importa el módulo asociado a la tabla
                let modelObj = require(`../model/${table}`);

                // Realiza la carga inical de datos usando el arreglo asociado a la tabla
                modelObj[table].bulkCreate(initialData[table])
                    .then(data => {
                        console.log(`All records created for ${table}`);
                    })
                    .catch(errors => {
                        console.error(`ERRORs inserting data for ${table}`, errors);
                    });
            } catch (err) {
                // Este error se genera cuando no existe el archivo asociado
                // al módulo correspondiente a la tabla en el modelo de datos.
                console.error(`ERROR Could not load data for table ${table}`, err);
            }
        });
    } else {
        console.log('Initial database records have already been loaded (change config.FIRST_RUN to true if this is required)');
    }
};
