Para poner este proyecto en marcha es necesario tener instalados:
  * NodeJS versión 6.1.0 o superior
  * MongoDB

Habrá que introducir algunos ficheros en la BBDD, para ello hay algunas líneas de código al final del fichero back-end/app.js. Basta con pasar estas después de la línea var grid = new Grid(db, mongodb); en el get de /ficheros (línea 15 del fichero)

Una vez instalados estos dos componentes, ejecutar en consola:
  * Ubicados en el directorio raíz del proyecto: "npm install"  //Esto instalará todas las dependencias del proyecto mediante npm
  * Ubicados en el directorio dónde hemos inicializado MongoDB, ejecutar el comando: "mongod --dbpath ." Esto iniciará MongoDB.
  * Para iniciar el servidor habrá que compilar el código. Para ello, ubicados en la raíz del proyecto, ejecutar: "gulp". Esto generará un directorio dist con todo el código compilado.
  * Con el código compilado, nos dirigimos a dist/back-end y ejecutamos "node app.js". Esto inicializará el servidor.

Con esto ya podremos acceder a la aplicación a través de la ruta localhost:3000 en el navegador.
