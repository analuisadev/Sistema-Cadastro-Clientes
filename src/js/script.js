'use strict';

//CRUD - Create Read Update Delete

const getDataBaseClient = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setDataBaseClient = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

const fillFields = (client) => {
    document.querySelector('form').children[0].value = client.name
    document.querySelector('form').children[1].value = client.email
    document.querySelector('form').children[2].value = client.phone
    document.querySelector('form').children[3].value = client.city
    document.querySelector('#name').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (e) => {
    if (e.target.type == 'button') {
        const [action, index] = e.target.dataset.action.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Você realmente deseja excluir o cliente ${client.name}`)
            if(response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')

    newRow.innerHTML = `
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.city}</td>
        <td>
            <button type="button" class="button green" data-action="edit-${index}">Editar</button>
            <button type="button" class="button red" data-action="delete-${index}">Excluir</button>
        </td>
    `

    document.querySelector('table>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('table>tbody tr')
    rows.forEach(row => {
        row.parentNode.removeChild(row)
    })
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const clearFields = () => {
    const fields = document.querySelectorAll('form input')

    fields.forEach(field => field.value = '')
}

const isNewClient = (client) => {
    const dbClients = readClient()

    return !dbClients.some(dbClient =>
        dbClient.email === client.email ||
        dbClient.phone === client.phone ||
        dbClient.name === client.name
    )
}

const isValidField = () => {
    return document.querySelector('form').reportValidity()
}

const saveClient = () => {
    if (isValidField()) {
        const client = {
            name: document.querySelector('form').children[0].value,
            email: document.querySelector('form').children[1].value,
            phone: document.querySelector('form').children[2].value,
            city: document.querySelector('form').children[3].value
        }

        const index = document.getElementById('name').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setDataBaseClient(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setDataBaseClient(dbClient)
}

const readClient = () => getDataBaseClient()

updateTable()

const createClient = (client) => {
    const dbClient = getDataBaseClient()

    if (!isNewClient(client)) {
        return window.alert("Cliente já cadastrado")
    }

    dbClient.push(client)
    setDataBaseClient(dbClient)
}


const openModal = () => document.querySelector('#modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.querySelector('#modal').classList.remove('active')
}

document.querySelector('main>button').addEventListener('click', openModal)
document.querySelector('header>span').addEventListener('click', closeModal)
document.querySelector('footer button[data-action="save"]').addEventListener('click', saveClient)
document.querySelector('footer button[data-action="cancel"]').addEventListener('click', closeModal)
document.querySelector('table>tbody').addEventListener('click', editDelete)