fetchDogs().then(data => {data.forEach(dog => {renderDog(dog)})})
document.getElementById('dog-form').addEventListener('submit', (e) => {
    e.preventDefault()
    for (let child of e.target.children) {
        if (child.value === "") {
            console.log('please provide all inputs')
            return
        }
    }

    const dogInfo = {}
    const form = e.target
    let i = 0
    while (i<form.length-1) {
        const child = form[i]
        dogInfo[child.name] = child.value
        i++
    }
    
    fetchDogs()
    .then(data => {
        const foundDog = data.find(dog => dog.name === dogInfo.name)
        foundDog ? updateDogInfo(dogInfo, foundDog) : createDog(dogInfo)        
    })

})

function fetchDogs() {
    return fetch('http://localhost:3000/dogs')
    .then(res => res.json())
}

function renderDog(dog) {
    const table = document.getElementById('table-body')
    const tableRow = document.createElement('tr')
    const name = document.createElement('td')
    const breed = document.createElement('td')
    const sex = document.createElement('td')
    const buttonContainer = document.createElement('td')
    const button = document.createElement('button')

    name.textContent = dog.name
    breed.textContent = dog.breed
    sex.textContent = dog.sex
    button.textContent = "edit"

    button.addEventListener('click', () => {
        populateForm(dog)
    })

    buttonContainer.append(button)
    tableRow.append(name, breed, sex, buttonContainer)
    table.append(tableRow)
}

function populateForm(dog) {
    const form = document.getElementById('dog-form')
    let i = 0
    while (i < form.length-1) {
        const child = form[i]
        child.value = dog[child.name]
        i++
    }

}

function createDog(dogInfo) {
    fetch(`http://localhost:3000/dogs`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dogInfo)
    })
    .then(res => res.json())
    .then(data => {renderDog(data)})
}

function updateDogInfo(dogInfo, dog) {
    console.time()
    fetch(`http://localhost:3000/dogs/${dog.id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(dogInfo)
    })
    .then(() => {
        const row = document.getElementById('table-body').children[dog.id-1].children
        const values = Object.values(dogInfo)
        let i = 0
        while (i<row.length-1) {
            row[i].textContent = values[i]
            i++
        }
        console.timeEnd()
    })
}