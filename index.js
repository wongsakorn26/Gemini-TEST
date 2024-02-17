const express = require("express");
const { chatPrompt, imageChat, chatHistoryPrompt } = require('./gemini')
const multer = require("multer")
const app = express();

app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

app.get('/api/chat', async (req, res) => {
    res.json({
        message: 'service ok'
    })
})

app.post('/api/chat', async (req, res) => {
    const { chat } = req.body
    const message = await chatPrompt(chat)
    res.json({
        message,
    })
})



app.post('/api/upload', upload.single("myFile"), async (req, res) => {
    const file = req.file
    const { chat } = req.body
    if(!file){
        return res.status(400).send("NO file upload")
    }

    if(!chat){
        return res.status(400).send("NO chat prompt")        
    }
    const fileData = file.buffer.toString("base64")
    const fileMimeType = file.mimetype
    
    const result = await imageChat(chat, fileData, fileMimeType)


    res.json({
        // fileData,
        // fileMimeType,
        result
    })
})

app.post("/api/history", async (req, res) => {
    const { chat , history} = req.body
    const result = await chatHistoryPrompt(chat , history)
    res.json({
        result
    })
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server run on Port ${PORT}`)
})