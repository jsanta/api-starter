// jshint esversion: 6
/**
 * Importa el modulo asociado al objeto correspondiente a la tabla Company en la base de datos
 */
const Company = require('./Company').Company;

/**
 * Se define el objeto JSON companyService, que será expuesto (module.exports) como servicio,
 * y sobre el que se definirán los métodos públicos que permitirán el acceso a los datos.
 */
let companyService = {};

/**
 * Para el caso de interacción con una base de datos, cada uno de los métodos es una
 * invocación de una consulta SQL, o bien un método, que permite acceder a la información y
 * ejecutar las acciones solicitadas.
 */

/**
 * Recupera el listado de compañías.
 * No aplica ningún criterio para la búsqueda.
 * @returns companyList :Array<Company> listado de compañías
 */
companyService.retrieveCompanies = () => {
    console.log('companyService.retrieveCompanies');
    // Operacion de rescate contra el ORM
    return Company.findAll();
};

/**
 * Rescata una compañia a partir de su identificador.
 * @param companyId :number Identificador de la compañía
 * @returns company :Company Objeto Compañia correspondiente al identificador
 */
companyService.retrieveCompany = (companyId) => {
    console.log(`companyService.retrieveCompany[${companyId}]`);
    let operationResult = {
        status: false,
        statusText: 'ERROR',
        statusCode: 400, // Bad Request
        msg: 'Debe indicar un ID válido para realizar la búsqueda'
    };
    // Sólo realizará la operación en caso de tener un identificador para el registro
    if (companyId) {
        // Realiza el rescate contra el ORM
        console.log(`Rescatando compañía[${companyId}]`);
        return Company.findById(companyId);
    }
    return Promise.reject(operationResult);
};

/**
 * Crea una nueva compañía a partir del objeto entregado como parámetro.
 * @param companyObj :Company Objeto Compañía que se va a crear. Nota: Este objeto NO ES
 * equivalente al objeto del ORM, ya que no tiene los métodos para poder operar contra la
 * base de datos.
 * @returns operationResult :JSON Resultado de la operación.
 */
companyService.createCompany = (companyObj) => {
    console.log(`companyService.createCompany: ${JSON.stringify(companyObj)}`);
    let operationResult = {
        status: false,
        statusText: 'ERROR',
        statusCode: 400, // Bad Request
        msg: 'No se puede operar con objetos vacíos.'
    };

    // Se valida que se entregue el objeto companyObj como parámetro
    if (companyObj) {
        // Realiza la creación contra el ORM
        console.log(`Creando compañía: ${JSON.stringify(companyObj)}`);
        return Company.create(companyObj);
    }
    return Promise.reject(operationResult);
};

/**
 * Actualiza los datos de la Compañía con identificador companyId.
 * Se debe entregar el objeto COMPLETO a actualizar. Si el método es invocado
 * sin el parámetro companyId, se tratará de opbtener el valor desde el objeto
 * entregado como parámetro.
 * @param companyObj :Company (obligatorio) Objeto Compañía
 * @param companyId :number (opcional) Identificador para la Companía a actualizar
 * @returns operationResult :JSON Resultado de la operación.
 */
companyService.modifyCompany = (companyObj, companyId) => {
    console.log(`companyService.modifyCompany: ${JSON.stringify(companyObj)}`);
    // Si no viene el parametro companyId tratará de sacarlo desde el objeto
    companyId = (!companyId) ? companyObj.id : companyId;
    let operationResult = {
        status: false,
        statusText: 'ERROR',
        statusCode: 400, // Bad Request
        msg: 'No se puede determinar sobre que registro operar.'
    };

    // Sólo realizará la operación en caso de tener un identificador para el registro
    // Se valida además que se entregue el objeto companyObj como parámetro
    if (companyObj && companyId) {
        // Realiza la actualización contra el ORM
        console.log(`Actualizando compañía[${companyId}]`);
        return Company.update(companyObj, {
            where: {
                id: companyId
            }
        });
    }
    return Promise.reject(operationResult);
};

/**
 * Elimina la Compañía con identificador companyId.
 * @param companyId :number (obligatorio) Identificador de la Companía a eliminar
 * @returns operationResult :JSON Resultado de la operación.
 */
companyService.removeCompany = (companyId) => {
    console.log(`companyService.removeCompany[${companyId}]`);
    let operationResult = {
        status: false,
        statusText: 'ERROR',
        statusCode: 400, // Bad Request
        msg: 'No se puede determinar sobre que registro operar.'
    };

    // Sólo realizará la operación en caso de tener un identificador para el registro
    if (companyId) {
        // Realiza la eliminación contra el ORM
        console.log(`Eliminando compañía[${companyId}]`);
        return Company.destroy({
            where: {
                id: companyId
            }
        });
    }
    return Promise.reject(operationResult);
};

/**
 * Todas las operaciones relativas al objeto Company deben estar incluidas en este servicio.
 * Si hubiera operaciones donde intervienen distintos objetos, los métodos deben ir en el servicio del
 * objeto "dominante" o más importante dentro de la consulta.
 */

module.exports = companyService;
