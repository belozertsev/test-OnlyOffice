const secret = "DiJrYaj3PTJgH1rz0ewxQ5j1oJhunq3s"
const options = { algorithm: "HS256", expiresIn: "5m" }

const express = require('express')
const app = express()
const fs = require('fs')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const axios = require('axios')
// const proxy = require('http-proxy-middleware')

const data = [
    // { filename: '1234567890_12345678_text.docx', originalname: 'test.docx', extension: 'docx' }
]

const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const name = `${Date.now()}_${Math.round(Math.random() * 1E8)}_${file.originalname}`
            cb(null, name)
        }
    })
})

app.use(express.static('uploads'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/api/getDocuments', (req, res) => {
    res.json(data)
})

app.post('/api/uploadDocument', upload.single('uploaded_file'), (req, res) => {
    data.push({
        filename: req.file.filename, // '1234567890_12345678_text.docx'
        originalname: req.file.originalname, // 'test.docx'
        extension: req.file.originalname.split('.').pop() // 'docx'
    })
    res.status(201).json({ status: true, message: 'File is uploaded' })
})

app.delete('/api/deleteDocument/:id', async (req, res) => {
    const filename = req.params.id
    const index = data.findIndex(item => item.filename === filename)

    if (index === -1) return res.status(404).json({ status: false, error: 'File is not found' })

    const deletedItem = data.splice(index, 1)[0]

    await fs.unlink(__dirname + `/uploads/${deletedItem.filename}`, (err) => {
        if (err) res.status(500).json({ status: false, error: 'An error occurred while deleting the file' })
        else res.json({ status: true, message: 'File is deleted' })
    })
})

app.get('/api/convertDocument/:id', async (req, res) => {
    const filename = req.params.id
    const index = data.findIndex(item => item.filename === filename)

    if (index === -1) return res.status(404).json({ status: false, error: 'Document isnt found' })

    let fileUrl = `http://192.168.109.130:3000/${req.params.id}`
    let fileType = data[index].extension

    const allowedTypes = [
        "djvu", "doc", "docm", "docx", "docxf", "dot", "dotm", "dotx", "epub",
        "fb2", "fodt", "htm", "html", "mht", "mhtml", "odt", "ott", "oxps",
        "rtf", "stw", "sxw", "txt", "wps", "wpt", "xml", "xps"
    ]
    if (!allowedTypes.includes(fileType)) return res.status(415).json({ status: false, error: 'File type is not supported' })

    let outputType = 'pdf'

    let key = () => {
        var key = ''
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'
        for (let i = 1; i <= 12; i++) {
            let char = Math.floor(Math.random() * str.length + 1)
            key += str.charAt(char)
        }
        return key
    }

    const payload = {
        "async": true,
        "filetype": fileType,
        "key": key,
        "outputtype": outputType,
        "title": `Converted.${outputType}`,
        "url": fileUrl
    }

    let token = jwt.sign(payload, secret, options);

    const response = await axios.post('http://192.168.109.130:80/ConvertService.ashx', { token })
    if (response.data.endConvert) {
        // console.log(response.data.fileUrl)
        return res.json({ status: true, link: response.data.fileUrl })
    }
    res.status(500).json({ status: false, error: 'Server couldn\'t convert given file' })
})

app.listen(3000, () => {
    console.log('## Server is listening on port 3000');
})
