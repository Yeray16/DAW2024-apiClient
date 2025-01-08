const express = require('express');
const app = express();
const PORT = 3000;
const CLIENT = require('./data/clients');
let idMax = Math.max(...CLIENT.map(client => client.id));

app.use(express.json());

app.get('/', (request, response) => {
  response.send('Hola Mundo !!');
})

app.get('/api', (request, response) => {
  response.send('api de clientes');
})

app.get('/api/client', (request, response) => {
  response.json(CLIENT.map(client => {
    return {
      id: client.id,
      nombre: client.nombre,
      apellidos: client.apellidos,
      email: client.cuenta.email
    }
  }));
})

// app.get('/api/client/:id', (request, response) => {
//   const id = request.params.id;
//   response.send('Datos del cliente con id: ' + id);
// });

app.get('/api/client/:id', (request, response) => {
  const id = request.params.id;
  let filterClient = CLIENT.filter(client => client.id == id);
  if (filterClient.length) {
    response.json(filterClient[0])
  } else {
    response.send('El cliente con id: ' + id + ' no ha sido encontrado');
  }

});

app.post('/api/client', (request, response) => {
  const newClient = request.body;
  let error = [];
  //comprobación 
  if(!newClient.nombre) error.push("nombre");
  if(!newClient.apellidos) error.push('apellidos');
  if(!newClient.cuenta.email) error.push("email");
  if (error.length == 0) {
    newClient.id = ++idMax;
    CLIENT.push(newClient);
    response.status(201).json(newClient);
  } else {
    response.status(422).send('Faltan los campos: ' + error.join(', '));
  }
})

app.delete('/api/client/:id', (request, response) => {
  const id = request.params.id;
  const indice = CLIENT.findIndex(client => client.id == id);
  if (indice >= 0) {
    CLIENT.splice(indice, 1);
    //response.status(200).send('Borrado');
    response.send('Borrado') // 200 es el valor por defecto
  } else {
    response.status(404).send('No encontrado');
  }  
})

app.put('/api/client/:id', (request, response) => {
  const id = request.params.id;
  let filterClient = CLIENT.filter(client => client.id == id);
  if (filterClient.length) {
    const client = filterClient[0];
    const newClient = request.body;
    client.nombre = newClient.nombre;
    client.apellidos = newClient.apellidos;
    client.cuenta.email = newClient.cuenta.email;
    response.send('Modificado');
  } else {
    response.status(404).send('Cliente con id = ' + id + ' no ha sido encontrado');
  }
})

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto ' + PORT);
});