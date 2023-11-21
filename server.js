const express = require("express")
const axios = require("axios")
const dotenv = require("dotenv")
const openai = require("openai")
const path = require("path")

dotenv.config() //inicializar la configuración

//configuración de express
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname)))

//rutas para las peticiones get (traer datos)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

//configurar al paquete openai
// se obtiene de https://platform.openai.com/api-keys
openai.apiKey = process.env.OPENAI_API_KEY //la variable que se colocó en .dotenv

//peticiones al chatbot (se crea una función asíncrona) 
//req:request res:response
app.post("/api/chatbot", async (req, res) => {
    try {
        const {message, context} = req.body

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions", //enlace de su documentacion
            { 
                messages: [
                    { role: "system", content: `${context}`},
                    {role: "user", content: `${message}`}
                ], //se envía al enlace de openai
                model: "gpt-4-vision-preview",
                max_tokens: 100,
                n:1, //requisito de openai
                temperature: 0.8, //nivel de creatividad 0 a 1
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )
        const reply = response.data.choices[0].message.content.trim()

        response.json({ reply })
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
})

const PORT = 3000 //puerto local
app.listen(PORT, () => {console.log("Servidor iniciado en el puerto 3000")})