const express = require('express')
const app = express()
const { cars } = require('./data')

app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1><a href="/api/cars">See Cars</a>')
})

// Cars list page
app.get('/api/cars', (req, res) => {
  const carList = cars
    .map((car) => {
      return `
      <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
        <h2>${car.name}</h2>
        <img src="${car.image}" alt="${car.name}" style="width: 150px; height: 150px;">
        <p><a href="/api/cars/${car.id}">View Details</a></p>
      </div>`
    })
    .join('')

  res.send(`
    <h1>Car List</h1>
    ${carList}
    <p><a href="/">Go Back Home</a></p>
  `)
})

// Single car detail page
app.get('/api/cars/:carID', (req, res) => {
  const { carID } = req.params
  const singleCar = cars.find(
    (car) => car.id === Number(carID)
  )

  if (!singleCar) {
    return res.status(404).send('<h1>Car Does Not Exist</h1><a href="/api/cars">Go Back</a>')
  }

  res.send(`
    <div style="border: 1px solid #ddd; padding: 10px;">
      <h1>${singleCar.name}</h1>
      <img src="${singleCar.image}" alt="${singleCar.name}" style="width: 250px; height: 250px;">
      <p>${singleCar.description}</p>
      <p>Price: $${singleCar.price}</p>
      <p><a href="/api/cars">Back to Cars</a></p>
    </div>
  `)
})

// Query cars (search and limit functionality)
app.get('/api/v1/query', (req, res) => {
  const { search, limit } = req.query
  let sortedCars = [...cars]

  if (search) {
    sortedCars = sortedCars.filter((car) =>
      car.name.toLowerCase().startsWith(search.toLowerCase())
    )
  }

  if (limit) {
    sortedCars = sortedCars.slice(0, Number(limit))
  }

  if (sortedCars.length < 1) {
    return res.send('<h1>No Cars Matched Your Search</h1><a href="/api/cars">Go Back</a>')
  }

  const carList = sortedCars
    .map((car) => {
      return `
      <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
        <h2>${car.name}</h2>
        <img src="${car.image}" alt="${car.name}" style="width: 150px; height: 150px;">
        <p><a href="/api/cars/${car.id}">View Details</a></p>
      </div>`
    })
    .join('')

  res.send(`
    <h1>Search Results</h1>
    ${carList}
    <p><a href="/api/cars">Back to Cars</a></p>
  `)
})

app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})
