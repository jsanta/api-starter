// jshint esversion: 6
// Ref.: https://github.com/expressjs/express/issues/3308
//       https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express
const Table = require('cli-table');
let table   = new Table({
    head:      ['', 'API', 'Name', 'Path'],
    colWidths: [8, 20, 20, 40]
});
function print (path, layer) {
    if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
        // console.log('%s /%s',
        //     layer.method.toUpperCase(),
        //     path.concat(split(layer.regexp)).filter(Boolean).join('/'));

        let row = {};
        let apiPath = path.concat(split(layer.regexp)).filter(Boolean).join('/');
        let apiPathArr = apiPath.match(/\/([.\w]+)/g);
        try {
            row[layer.method.toUpperCase()] = [
                apiPathArr[0],
                (!apiPathArr[1]) ? apiPathArr[0] : apiPathArr[1],
                '/' + path.concat(split(layer.regexp)).filter(Boolean).join('/')
            ];
            table.push(row);
        } catch (err) {
            console.error('No parsable rows.');
        }
    }
}

function split (thing) {
    if (typeof thing === 'string') {
        return thing.split('/');
    } else if (thing.fast_slash) {
        return '';
    } else {
        let match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
        return match ? match[1].replace(/\\(.)/g, '$1').split('/')
            : '<complex:' + thing.toString() + '>';
    }
}

// Ref.: https://github.com/arvindr21/listMyAPI
// function listApi (routes, src) {
//     // var Table = require('cli-table');
//     var table = new Table({
//         head: ['', 'Name', 'Path']
//     });

//     console.log('\nAPI for this service \n');
//     let key, val, _o;
//     if (src === 'restify') {
//         console.log('\n********************************************');
//         console.log('\t\tRESTIFY');
//         console.log('********************************************\n');
//         for (key in routes) {
//             if (routes.hasOwnProperty(key)) {
//                 val = routes[key];
//                 _o = {};

//                 _o[val.method] = [val.name, val.spec.path];
//                 table.push(_o);
//             }
//         }
//     } else {
//         console.log('\n********************************************');
//         console.log('\t\tEXPRESS');
//         console.log('********************************************\n');
//         for (key in routes) {
//             if (routes.hasOwnProperty(key)) {
//                 val = routes[key];
//                 if (val.route) {
//                     val = val.route;
//                     _o = {};
//                     _o[val.stack[0].method] = [val.path, val.path];
//                     table.push(_o);
//                 }
//             }
//         }
//     }
//     console.log(table.toString());

//     return table;
// };
function retrieveEndpoints(_table, routerStack) {
    table = _table;
    routerStack.forEach(print.bind(null, []));

    return table;
};

module.exports = function (routerStack) {
    let _table   = new Table({
        head:      ['', 'API', 'Name', 'Path'],
        colWidths: [8, 20, 20, 40]
    });
    retrieveEndpoints(_table, routerStack);
    console.log(_table.toString());
};
