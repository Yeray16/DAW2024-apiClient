const tbody = document.querySelector('tbody');
const properties = ['nombre', 'apellidos', 'email'];
const divDetails = document.getElementById('details');
const inputNombre = document.getElementById('nombre');
const inputApellidos = document.getElementById('apellidos');
const inputEmail = document.getElementById('email');
const buttonCrear = document.getElementById('crear');
const editPanel = document.getElementById('edit-panel');
const buttonCancelar = document.getElementById('cancelar');
const buttonGuardar = document.getElementById('guardar')
const editNombre = document.getElementById('edit-nombre');
const editApellidos = document.getElementById('edit-apellidos');
const editEmail = document.getElementById('edit-email');
const editId = document.getElementById('edit-id')

fetch('/api/client')
  .then(response => response.json())
  .then(clients => {
    console.log(clients);
    clients.forEach(client => addClient(client));
  });

function addClient(client) {
  const tr = document.createElement('tr');
  properties.forEach(property => {
    const td = document.createElement('td');
    td.textContent = client[property];
    tr.append(td);
  })
  tr.dataset.id = client.id;
  tbody.append(tr);
}

tbody.addEventListener('click', (event) => {
  const tr = event.target.closest('tr');
  const id = tr.dataset.id;
  console.log(id);
  fetch('api/client/' + id)
    .then(response => response.json())
    .then(client => showClient(client))
});

function showClient(client) {
  console.log(client);
  divDetails.innerHTML = `<h1>${client.nombre}${client.apellidos}</h1>
                          <h2>${client.cuenta.email}</h2>
                          <p>${client.direccion.localidad}</p>
                          <button onclick="deleteClient(${client.id})">Eliminar</button>
                          <button onclick="editClient()">Modificar</button>`
  editNombre.value = client.nombre;
  editApellidos.value = client.apellidos;
  editEmail.value = client.cuenta.email;
  editId.value = client.id;
}

buttonCrear.addEventListener('click', () => {
  console.log('creando cliente...');
  const client = {
    nombre: inputNombre.value,
    apellidos: inputApellidos.value,
    "cuenta": {
      "email": inputEmail.value,
      "username": "hharkin18",
      "password": "BGjuN0MnsDEK",
      "idioma": "Catalan"
    },
    "direccion": {
      "localidad": "Arona",
      "calle": "School"
    },
    "fecha_nacimiento": "1962/12/29",
    "estado": {
      "vip": false,
      "visitas_mes": 57,
      "preferencias": [
        "música",
        "fotografía",
        "electrónica"
      ]
    }
  }
  console.log(client);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(client)
  }
  fetch('/api/client', options)
  .then(response => {
    if(response.status == 201) {
      //insertarlo en la tabla
      response.json()
      .then(client => addClient({
        id: client.id,
        nombre: client.nombre,
        apellidos: client.apellidos,
        email: client.cuenta.email
      }));
    } else {
      //Mostrar error
      response.text()
      .then(error => console.log('error en los datos: ' + error));
    }
  });
})

function deleteClient(id) {
  console.log('Eliminando cliente con id: ' + id);
  fetch('/api/client/' + id, {method: 'DELETE'})
  .then(response => {
    if (response.status == 200) {
      console.log('El cliente ha sido eliminado');
      divDetails.innerHTML = '';
      const trClient = document.querySelector('[data-id = "' + id + '"]');
      console.log(trClient)
      trClient.remove();
    } else {
      console.log('El cliente no ha sido encontrado');
    }
  })
}

function editClient() {
  editPanel.hidden = false;
}

buttonCancelar.addEventListener('click', () => editPanel.hidden = true);

buttonGuardar.addEventListener('click', () => {
  fetch('/api/client/' + id)
});