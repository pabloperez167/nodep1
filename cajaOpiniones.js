'use strict'

const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');
const {run} = require("node-matlab");

let info;


const mime = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'jpg'  : 'image/jpg',
    'ico'  : 'image/x-icon',
    'mp3'  : 'audio/mpeg3',
    'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {

    const objetourl = url.parse(pedido.url);
    let camino='public'+objetourl.pathname;
    if (camino=='public/')
        camino='public/home.html';
    encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);
console.log('Servidor corriendo en http://localhost:8888')



function encaminar (pedido,respuesta,camino) {
    console.log(camino);

    switch (camino) {
        case 'public/versentimiento': {
            console.log('Vamos a recuperar el archivo sentimiento.txt');
            fs.readFile('C:\\Users\\pplim\\Downloads\\sentimiento.txt', function (err, data) {
                if (err) {
                    throw err;
                }else{
                    console.log('Archivo correctamente leido')
                }
                console.log(data.toString());
                respuesta.writeHead(200, {'Content-Type': 'text/html'});
                respuesta.write(data);
                return respuesta.end();
            });
            break;
        }
        case 'public/grabaropinion':{
            console.log('Vamos a grabar la opinion en el archivo opinion.txt');//Procesamiento de los datos de los formularios

            info=''; //Una variable auxiliar
            pedido.on('data', tmp => {
                info+=tmp;
            }); // Un evento que copia lo que viene desde un formulario en la variable info

            pedido.on('end',() =>{ // La escritura del archivo dentro del evento: Idea feliz
                let datosformulario;
                datosformulario=querystring.parse(info); // Se guarda en un formato "preguntable" desde javascript
                let opinionf;
                opinionf=datosformulario['comentario']; // el formato es nombrevar=contenido&nombrevar2=contenido&...

                fs.writeFile('C:\\Users\\pplim\\Downloads\\opinion.txt',opinionf,{ flag: 'w+' }, err => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    else{
                        console.log('Archivo correctamente escrito')
                    }
                    //file written successfully
                    console.log(opinionf) //Esto es para ver que funciona

                } )
            });
            break;
        };

        case 'public/showopinion': {
            console.log('Vamos a recuperar el archivo opinion.txt');
            let datosformulario;
            datosformulario=querystring.parse(info); // Se guarda en un formato "preguntable" desde javascript
            let opinionf;
            opinionf=datosformulario['comentario'];

                console.log(opinionf);
                respuesta.writeHead(200, {'Content-Type': 'text/html'});
                respuesta.write(opinionf);
                return respuesta.end();

            break;
        }
        case 'public/guardarDB': {
            console.log('Guardar la opinion y el sentimiento en una txt');
            let datosformulario;
            datosformulario = querystring.parse(info); // Se guarda en un formato "preguntable" desde javascript
            let opinionf;
            opinionf = datosformulario['comentario'];
                 fs.readFile('C:\\Users\\pplim\\Downloads\\sentimiento.txt', function (err, data) {
                        if (err) {
                            throw err;
                        } else {
                            console.log(data.toString());
                            fs.appendFile('nodep1bd.txt',opinionf+ "-" +data.toString(), err => {
                                if (err) throw err;
                                else {
                                    console.log('Archivo correctamente escrito');
                                }
                            })

                        }
                    })
            break;
                }

        default : {
            fs.stat(camino, error => {
                if (!error) {
                    fs.readFile(camino,(error, contenido) => {
                        if (error) {
                            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
                            respuesta.write('Error interno');
                            respuesta.end();
                        } else {
                            const vec = camino.split('.');
                            const extension=vec[vec.length-1];
                            const mimearchivo=mime[extension];
                            respuesta.writeHead(200, {'Content-Type': mimearchivo});
                            respuesta.write(contenido);
                            respuesta.end();
                        }
                    });
                } else {
                    respuesta.writeHead(404, {'Content-Type': 'text/html'});
                    respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
                    respuesta.end();
                }
            });
        }
    }
}
