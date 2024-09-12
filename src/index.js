import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import translate from 'node-google-translate-skidz';

const app = express();
const PORT = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', async (req,res) => {
    try {
        //solicitud asincrónica a la Api, espera a que la solicitud termine antes de seguir
        const response = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/departments')
        //se guardan los datos de los departamentos en la variable
        const departamentos = response.data.departments;

        const departamentosTraducidos  = await Promise.all(departamentos.map(async (departamento) => {
            try {
                const nombreTraducido = await traducirTexto(departamento.displayName,'en', 'es');
                return {
                    ...departamento,
                    displayName:nombreTraducido
                };
            } catch (error) {
                console.error(`Error al traducir el departamento ${departamento.displayName}:`, error);
                return departamento;
            }
        }))
        
        res.render('index',{ 
            departamentosTraducidos 
        });
    } catch (error) {
        console.error('Error al obtener departamentos', error);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta de búsqueda
app.get('/search', async (req, res) => {
    try {
        const departmentId = req.query.departmentId || '';
        const keyword = req.query.keyword || '';
        const location = req.query.location || '';
        const page = parseInt(req.query.page) || 1;
        const limit = 20; 
        const offset = (page - 1) * limit;

        let url = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true`;

        if (departmentId) {
            url += `&q=''departmentId=${departmentId}`;
        }
        if (keyword) {
            url += `&q=${keyword}`;
        }
        if (location) {
            url += `&q=''geoLocation=${location}`;
        }
        
        console.log("URL de la API:", url);

        const response = await axios.get(url);

        if (!response.data || !Array.isArray(response.data.objectIDs) || response.data.objectIDs.length === 0) {
            return res.render('results', {
                objects: [],
                page,
                totalPages: 0,
                message: 'No se encontraron resultados para los filtros aplicados.'
            });
        }

        let objectIDs = response.data.objectIDs;
        const validObjects = [];
        let currentIndex = offset;

        while (validObjects.length < limit && currentIndex < objectIDs.length) {
            const batchIDs = objectIDs.slice(currentIndex, currentIndex + limit * 2); 
            const promises = batchIDs.map(id => 
                axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
                    .catch(err => {
                        console.error(`Error al recuperar el objeto con ID ${id}:`, err.message);
                        return null; 
                    })
            );

            const objects = await Promise.all(promises);

            const filteredObjects = objects.filter(obj => obj !== null);

            const translatedObjects = await Promise.all(filteredObjects.map(async obj => {

                if (obj && obj.data) {
                    const { objectDate = '', title = '', culture = '', dynasty = '' } = obj.data;

                    try {
                        const translatedDate = objectDate ? await traducirTexto(objectDate, 'en', 'es') : objectDate;
                        const translatedTitle = title ? await traducirTexto(title, 'en', 'es') : title;
                        const translatedCulture = culture ? await traducirTexto(culture, 'en', 'es') : culture;
                        const translatedDynasty = dynasty ? await traducirTexto(dynasty, 'en', 'es') : dynasty;
                    
                        return {
                            ...obj.data,
                            objectDate : translatedDate,
                            title: translatedTitle,
                            culture: translatedCulture,
                            dynasty: translatedDynasty,
                        };
                    } catch (rrorAlTraducir) {
                        console.error("Error en la traducción:", rrorAlTraducir);
                        return obj.data; 
                    }
                }
                return null;
            }));

            validObjects.push(...translatedObjects.filter(obj => obj !== null).slice(0, limit - validObjects.length));
            currentIndex += batchIDs.length;
        }

        const totalObjects = response.data.total || 0;
        const totalPages = Math.ceil(totalObjects / limit);

        console.log(`Total de objetos encontrados: ${objectIDs.length}`);
        console.log(`Total de paginas: ${totalPages}`);
        

        res.render('results', {
            objects: validObjects,
            page,
            totalPages,
            departmentId,
            keyword,
            location
        });

    } catch (error) {
        console.error("Error en la consulta a la API:", error.message, error.stack);
        res.status(500).send(`Error al recuperar los objetos de arte: ${error.message}`);
    }
});

//solicitud a la API de los objetos por id para obtener tetalles especificos de los mismos, en este caso quiero obtener las imagenes adicionales para mostrarlas en aditionalImages.pug
app.get('/object', async (req,res) =>{
    try {
        const objectId= req.params.id;
        const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);

        if (response.data) {
            const object = response.data;
            const tituloTraducido = object.title ? await traducirTexto(object.title, 'en', 'es') : object.title;

            const objetoTraducido = {
                ...object,
                title: tituloTraducido
            }
            console.log("Objeto traducido:", objetoTraducido);
            res.render('results', {
                object: objetoTraducido 
            })
        } else {
            res.status(404).send('Objeto no encontrado.');
        }
    } catch (error) {
        console.error('Error al obtener el objeto', error);
        res.status(500).send(`Error al recuperar el objeto: ${error.message}`);
        
    }
})

function traducirTexto(texto, idiomaOrigen = 'en', idiomaDestino = 'es') {

    return new Promise((resolve, reject) => {
        translate({
            text: texto,
            source: idiomaOrigen,
            target: idiomaDestino
        }, function(result) {
            if (result && result.translation) {
                resolve(result.translation);
            } else {
                console.error(`Error en la traducción del texto: "${texto}"`);
                reject(new Error('Error en la traducción'));
            }
        });
    });
}


app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}`);
});
