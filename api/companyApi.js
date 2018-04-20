// jshint esversion: 6
const companyService = require('../model/companyService');

module.exports = (router) => {
    router.get('/company', (req, res) => {
        console.log('GET /company');
        companyService.retrieveCompanies()
            .then(results => {
                res.json(results);
            })
            .catch(err => {
                res.status(400);
                res.json(err);
            });
    });
    router.get('/company/:companyId', (req, res) => {
        const companyId = req.params.companyId;
        console.log(`GET /company/${companyId}`);
        companyService.retrieveCompany(companyId)
            .then(result => {
                res.json(!result ? {} : result);
            })
            .catch(err => {
                res.status(err.statusCode);
                res.json(err);
            });
    });

    router.post('/company', (req, res) => {
        const company = req.body;
        console.log('POST /company', company);
        companyService.createCompany(company)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                /**
                 * IMPORTANTE: Para el caso de errores SQL se recomienda editar los mensajes
                 * de modo de no exponer información sensible del modelo de datos.
                 */
                res.status(err.statusCode ? err.statusCode : 400);
                // res.json(err);
                res.json({
                    status: false,
                    statusText: 'ERROR',
                    statusCode: 400, // Bad Request
                    msg: 'ERRORs: ' + (!err.errors) ? err.parent.sqlMessage : (err.errors || []).map(v => v.message).join('; ')
                });
            });
    });

    router.put('/company/:companyId', (req, res) => {
        const companyId = req.params.companyId;
        const company = req.body;
        console.log(`PUT /company/${companyId}`, company);

        /**
         * Intenta actualizar el registro y devuelve el registro modificado
         * desde la base de datos.
         * Ref.: https://medium.com/@sarahdherr/sequelizes-update-method-example-included-39dfed6821d
         */
        companyService.modifyCompany(company, companyId)
            .then(() => companyService.retrieveCompany(companyId))
            .then(result => {
                res.json(!result ? {} : result);
            })
            .catch(err => {
                /**
                 * IMPORTANTE: Para el caso de errores SQL se recomienda editar los mensajes
                 * de modo de no exponer información sensible del modelo de datos.
                 */
                res.status(err.statusCode ? err.statusCode : 400);
                // res.json(err);
                res.json({
                    status: false,
                    statusText: 'ERROR',
                    statusCode: 400, // Bad Request
                    msg: 'ERRORs: ' + (!err.errors) ? err.parent.sqlMessage : (err.errors || []).map(v => v.message).join('; ')
                });
            });
    });

    router.delete('/company/:companyId', (req, res) => {
        const companyId = req.params.companyId;
        console.log(`DELETE /company/${companyId}`);
        /**
         * IMPORTANTE: El borrado de registros es lógico. Los registros son marcados en la
         * base de datos como eliminados, pero siguen existiendo con la fecha de eliminación
         * en el campo deletedAt.
         */
        companyService.removeCompany(companyId)
            .then(result => {
                res.json(!result ? {} :
                    {
                        status: true,
                        statusText: 'OK',
                        statusCode: 200,
                        msg: `Company[${companyId}] deleted`
                    });
            })
            .catch(err => {
                res.status(err.statusCode);
                res.json(err);
            });
    });

    return router;
};
