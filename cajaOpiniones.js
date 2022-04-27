'use strict'

const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');
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

function spawn(mat, param2) {
    return undefined;
}

function encaminar (pedido,respuesta,camino) {
    console.log(camino);

    switch (camino) {
        case 'public/versentimiento': {
            console.log('Vamos a recuperar el archivo sentimiento.txt');
/*
            const matlab = require("node-matlab");

            matlab
                .run("C:\\Users\\pplim\\Downloads\\JT_lstm_prod2.m")
                .then((result) => console.log(result))
                .catch((error) => console.log(error));*/

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
            console.log('Vamos a grabar la opinion en el archivo opinion.txt');
            //Procesamiento de los datos de los formularios

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
                    /*try {
                        const data = fs.readFileSync('C:\\Users\\pplim\\Downloads\\JT_lstm_prod2', 'utf8');
                        console.log(data.toString());
                    } catch (err) {
                        console.error(err);
                    }*/
                    if (err) {
                        console.error(err)
                        return
                    }
                    else{
                        console.log('Archivo correctamente escrito')
                    }
                    //file written successfully
                    console.log(opinionf) //Esto es para ver que funciona
                    console.log(info) // funciona
                    console.log(datosformulario['opinion']); // y vuelve a funcionar...
                } )
            });
            let pagina;
            pagina='public/home.html'; // en pagina principal hay un codigo html. Ahora os lo enseño.
            /////
            break;
        };

        case 'public/showopinion': {
            console.log('Vamos a recuperar el archivo opinion.txt');
            fs.readFile('C:\\Users\\pplim\\Downloads\\opinion.txt', function (err, data) {
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
