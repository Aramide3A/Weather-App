const express = require('express')
const app = express()
const http = require('http')
const axios = require('axios')
require('dotenv').config()

app.use(express.json())


app.post('/api/data', async (req, res) => {
    try {
		const city = req.body.city
		if (!city) {
            return res.send("City is missing in the request body")
        }
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${process.env.API_KEY}`);
        const lat = response.data[0].lat
		const lon = response.data[0].lon
		const response2 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`)
		const weather = {
			'weather': response2.data.weather[0].description,
			"temperature" : `${response2.data.main.temp}°C`,
			"minimum temperature" : `${response2.data.main.temp_min}°C`,
			"maximum temperature" : `${response2.data.main.temp_max}°C`,
		}
		res.send(weather)
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
