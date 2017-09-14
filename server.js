import db from './db.json'

var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser')
var multer = require('multer')

var upload = multer()
var app = express()
var myLogger = function (req, res, next) {
    console.log('show log')
    next()
}

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(myLogger)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.array('file',2) ,function(req, res,next) {
    res.send(req.files);
});

app.get('/product', function (req, res) {
    res.send(db)
})

app.get('/product/:id', function(req, res) {
    const results = { "results": [ ...db] }
    let getproductId = results.results.find(product => product.id === req.params.id)
    res.send(getproductId)
})

app.post('/product', upload.array(), function (req, res, next) {
    let obj = [ ...db]
    obj.push({
        id: req.body.id,
        text: req.body.text,
        completed: req.body.quantity
    })
    fs.writeFile('db.json', JSON.stringify(obj, null, 4) , 'utf8', function readFileCallback(err, data){
        if(err){
            res.send(err)
        }else{
            var db = [
                ...db,
                {
                  id: req.body.id,
                  text: req.body.text,
                  completed: req.body.quantity
                }
            ]
        }
    })
    res.status(201).send(obj)
})

app.put('/product/:id', upload.array(), function (req, res, next){
    db.map((data,key)=>{
        if(data.id ==  req.params.id){
            data.text = req.body.text
            data.quantity = req.body.quantity
        }
    })
    fs.writeFile('db.json', JSON.stringify(db, null, 4) , 'utf8', function readFileCallback(err, data){
        if(err){
            res.send(err)
        }
    })
    res.send(db)
})

app.delete('/product/:id', function (req, res) {
    let obj = [ ...db]
    var productIndex
    let getproductId = obj.find((product,i) => {
        if(product.id === req.params.id){
            productIndex = i
        }
    })
    // delete obj[productIndex]
    obj.splice(productIndex,1)
    res.send(obj)
    
})


// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// app.get('/books', (req, res) => {
//   res.json(books)
// })

// app.get('/books/:id', (req, res) => {
//   res.json(books.find(book => book.id === req.params.id))
// })

// app.post('/books', (req, res) => {
//   books.push(req.body)
//   res.status(201).json(req.body)
// })

// app.put('/books/:id', (req, res) => {
//   const updateIndex = books.findIndex(book => book.id === req.params.id)
//   res.json(Object.assign(books[updateIndex], req.body))
// })

// app.delete('/books/:id', (req, res) => {
//   const deleteIndex = books.findIndex(book => book.id === req.params.id)
//   books.splice(deleteIndex, 1)
//   res.status(204).send()
// })

// app.listen(3000, () => {
//   console.log('Start server at port 3000.')
// })

app.listen(3001)