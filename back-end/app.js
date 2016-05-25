var express = require('express');
var mongodb = require('mongodb');
var Grid = require('gridfs-stream');
var fs = require('fs');
// var mongoose = require('mongoose');

const router = express.Router();
const app = express();

app.use(express.static('../front-end'));

app.get('/ficheros', function(req, res){
  var db = new mongodb.Db('gridfs', new mongodb.Server('localhost', 27017));
  db.open(function(err, db) {
    var grid = new Grid(db, mongodb);
    mongodb.GridStore.list(db, function(err, files) {
      if(err)
        console.log(err);
      else{
        var filesJSON = {};
        for(var i in files){
          grid.files.find({ filename: files[i] }).toArray(function (err, fileData) {
            filesJSON[fileData[0].filename] = fileData[0];
            if(Object.keys(filesJSON).length == files.length)
              res.json(filesJSON);
          });
        }
      }
    });
  });
});

app.get('/filtraArchivos', function(req, res){
  var db = new mongodb.Db('gridfs', new mongodb.Server('localhost', 27017));
  db.open(function(err, db) {
    var grid = new Grid(db, mongodb);
    grid.files.find(
      {
        "metadata.asignatura": {
          $in: req.query.asignaturas
        },
        "metadata.semestre": {
          $in: req.query.semestres
        },
        "metadata.tipo": {
          $in: req.query.tipos
        },
      }
    ).toArray(function (err, files) {
      if (err)
        console.log(err);
      else{
        for(var i in files){
          console.log(files[i]);
        }
        res.json(files);
      }
    });
  });
});


app.listen(3000, function(){
  console.log('Servidor iniciado con Express en puerto 3000')
});

// var writestream = grid.createWriteStream({
//   filename: 'Conjuntos.pdf',
//   metadata: {
//     curso: '1',
//     semestre: '1',
//     asignatura: 'Matemática Discreta I',
//     autor: 'Víctor Punzano',
//     tipo: 'Teoría'
//   }
// });
// fs.createReadStream('F:\\Universidad\\1º\\Matematica Discreta I\\Conjuntos.pdf').pipe(writestream);
//
// writestream = grid.createWriteStream({
//   filename: 'HojaProblemas1.pdf',
//   metadata: {
//     curso: '1',
//     semestre: '1',
//     asignatura: 'Matematica Discreta',
//     autor: 'Victor Punzano',
//     tipo: 'Ejercicios'
//   }
// });
// fs.createReadStream('F:\\Universidad\\1º\\Matematica Discreta I\\Ejercicios\\HojaProblemas1.pdf').pipe(writestream);
//
// writestream = grid.createWriteStream({
//   filename: 'PRGII_Tema_1.pdf',
//   metadata: {
//     curso: '1',
//     semestre: '2',
//     asignatura: 'Programación II',
//     autor: 'Ángel Lucas González Martínez, Jaime Ramírez, Guillermo Román',
//     tipo: 'Teoría'
//   }
// });
// fs.createReadStream('F:\\Universidad\\2º\\Programacion II\\Parcial 1\\PRGII_Tema_1.pdf').pipe(writestream);
//
// writestream = grid.createWriteStream({
//   filename: '3.InterpolHermite.pdf',
//   metadata: {
//     curso: '2',
//     semestre: '3',
//     asignatura: 'Algorítmica Numérica',
//     autor: 'Roberto Sánchez',
//     tipo: 'Teoría'
//   }
// });
// fs.createReadStream('F:\\Universidad\\3º\\Algoritmica Numerica\\Teoria\\3. InterpolHermite.pdf').pipe(writestream);
//
// writestream = grid.createWriteStream({
//   filename: 'Procesos.pdf',
//   metadata: {
//     curso: '2',
//     semestre: '4',
//     asignatura: 'Sistemas Operativos',
//     autor: 'Pedro de Miguel Anasagasti',
//     tipo: 'Teoría'
//   }
// });
// fs.createReadStream('F:\\Universidad\\4º\\Sistemas Operativos\\Tema 3(Procesos)\\Procesos.pdf').pipe(writestream);
//
// writestream = grid.createWriteStream({
//   filename: 'Info_Proyecto.docx',
//   metadata: {
//     curso: '3',
//     semestre: '5',
//     asignatura: 'Procesadores de Lenguajes',
//     autor: 'David Ruiz',
//     tipo: 'Proyecto'
//   }
// });
// fs.createReadStream('F:\\Universidad\\5º\\Procesadores de Lenguajes\\Proyecto\\Info_Proyecto.docx').pipe(writestream);
//
// writestream = grid.createWriteStream({
//   filename: 'Examen SOS junio 2013_Solución.pdf',
//   metadata: {
//     curso: '3',
//     semestre: '6',
//     asignatura: 'Sistemas Orientados a Servicios',
//     autor: 'Manuel Yubero',
//     tipo: 'Examen'
//   }
// });
// fs.createReadStream('F:\\Universidad\\6º\\Sistemas Orientados a Servicios\\Examenes\\Examen SOS junio 2013_Solución.pdf').pipe(writestream);
//
// writestream = grid.createWriteStream({
//   filename: 'I2T_T1.2_Arquitectura_v1.3s.ppt',
//   metadata: {
//     curso: '4',
//     semestre: '8',
//     asignatura: 'Ingeniería de Integración Tecnológica',
//     autor: 'Felipe Fernández',
//     tipo: 'Teoría'
//   }
// });
// fs.createReadStream('F:\\Universidad\\8º\\Ingeniería de Integración Tecnológica(Optativa)\\I2T_T1.2_Arquitectura_v1.3s.ppt').pipe(writestream);
