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

function encaminar (pedido,respuesta,camino) {
    console.log(camino);
    switch (camino) {
       /*case 'public/recuperardatos': {
            recuperar(pedido,respuesta);
            break;
        }*/
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

                fs.writeFile('opinion.txt',opinionf,{ flag: 'w+' }, err => {
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

/*En este codigo se tiene que recuperar el sentimiento*/
function recuperar(pedido,respuesta) {
    let info = '';
    pedido.on('data', datosparciales => {
        info += datosparciales;
    });
    pedido.on('end', () => {
        const formulario = querystring.parse(info);
        respuesta.writeHead(200, {'Content-Type': 'text/html'});
        const pagina=
            `<!doctype html><html><head></head><body>
    Comentario: ${formulario['comentario']}<br>
    
    <a href="home.html">Retornar</a>
    </body></html>`;
        respuesta.end(pagina);
    });
}