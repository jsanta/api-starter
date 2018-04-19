// jshint esversion: 6
/**
 * El comentario jshint es para  indicar al parser de javascript del editor que se utilizarán
 * características de ES6 (EcmaScript 6), como funciones de flecha, const, let, y otros.
 */

/**
 * Requeridos para poder definir la API
 * - express: permite definir los endpoints de la aplicación
 * - cors: permite que los endpoints de la API sean accesibles desde servidores externos
 * - bodyparser: simplifica el rescate de parametros de los endpoints de la API
 * - router: encargado de la gestión de rutas (endpoints) de la aplicación
 */
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const router     = express.Router();

/**
 * Permite una configuración bajo la cual los paquetes transferidos DESDE el servidor vayan
 * comprimidos. Esto significa una mejora de rendimiento, ya que el tamaño del paquete de
 * transferencia es menor (menos datos --> transferencia más rápida)
 */
const compression = require('compression');

/**
 * La configuración de la aplicación debe manejarse en un archivo externo.
 */
const config = require('./config/config');

/**
 * Define la aplicación express, y define un servidor HTTP que la va a utilizar.
 * Nótese que se utiliza let en vez de const para definir la variable app. Esto es ya que app va
 * a cambiar en su valor en otras partes del programa.
 */
let app    = express();
const http = require('http').Server(app);

/**
 * Se le indica a la aplicación utilizar CORS para permitir llamadas a la API desde distintos
 * orígenes. CORS permite la definición de ciertos parámetros, entre ellos los relativos a las
 * cabeceras de las peticiones HTTP, y los métodos que se van a admitir.
 * Si no se pasa ningún objeto como parámetro CORS va a utilizar la configuración por defecto de
 * la librería.
 */
app.use(cors({
    origin:               true,
    methods:              [ 'GET', 'POST', 'OPTIONS', 'PUT', 'DELETE' ],
    allowedHeaders:       [ 'Content-Type', 'Authorization', 'X-Requested-With' ],
    exposedHeaders:       [ 'X-Token', 'X-RefreshToken' ],
    preflightContinue:    false,
    optionsSuccessStatus: 204
}));

/**
 * Body-Parser es una librería de tipo middleware que permite a express un manejo simplificado de los
 * parámetros que recibe cada petición HTTP.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

/**
 * Se indica el nivel de compresión para las peticiones. Si no se indica nada se considerará la configuración
 * por defecto de la librería. Esto va a depender de cada requerimiento particular, por lo que se recomienda
 * referirse a la correspondiente documentación.
 */
app.use(compression({ level: 1 }));

/**
 * Setea el puerto donde va a estar escuchando el servidor. Obtiene esta información desde el archivo de
 * configuración.
 */
const ipAddress = config.APP_IP;
const port      = config.APP_PORT;
app.set('port', port);

/**
 * Inicializa el modelo de la base de datos y realiza la carga inicial de datos
 * (si es necesario)
 */
const initDB = require('./model');
initDB();

/**
 * AQUI SE DEFINE LA API
 * Esta definición puede ser directamente en esta sección, pero si la API comenzara a crecer, el archivo
 * también crecerá proporcionalmente. Para efectos de mantención y separación de responsabilidades es mejor
 * manejar la lógica de la API en archivos separados.
 */
app.use('/api', require('./api/companyApi')(router));

/**
 * Se define y ejecuta el servidor HTTP con la aplicación Express.
 * Esto podría hacerse derechamente con app.listen(port), pero hay casos donde se requiere mayor control
 * sobre el objeto servidor y las funciones que provee (por ejemplo monitorear los sockets de conexión).
 */
const server = http.listen(app.get('port'), ipAddress, () => {
    console.log('Server started on localhost:' + port + '; Press Ctrl-C to terminate.');
    console.log('Application worker ', process.pid, ' started...');

    const routeList = require('./utils/routeList');
    routeList(app._router && app._router.stack);

});

