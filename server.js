'use strict';

// Application Dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

// Application Setups
const PORT = process.env.PORT || 3000;
const server = express();
server.set('view engine','ejs');
server.use(express.urlencoded({ extended: true }));
server.use(express.static('./public'))


//testing
server.get('/hello',(req,res)=>{
    res.render('pages/index');
})

//home
server.get('/', (req, res) => {
    res.render('pages/index');
})
//searches
server.get('/searches/new',(req,res)=>{
    res.render('pages/searches/new');
});

//error
server.get('*',(req,res)=>{
    res.render('pages/error');
});

  //search results
server.post('/searches', resultHandler);
 
function resultHandler(req,res){
    let Book = req.body.search;
    let term= req.body.searchBy;
    // console.log(Book ,term);
    let URL =`https://www.googleapis.com/books/v1/volumes?q=search+${term}:${Book}`;
  superagent .get(URL)
    .then(booksData => {
      let booksArr = booksData.body.items.map(item => new Books(item));
      res.render('pages/searches/show', { bookArray: booksArr });
    })
    .catch (error=>{
        console.log(error);
        res.send(error);
      });
}


//construct function 

function Books(Data){
this.title = Data.volumeInfo.title;
this.author = Data.volumeInfo.authors;
if(Data.volumeInfo.description){
    this.description = Data.volumeInfo.description;}else{
    this.description = `The description not found `;}
if (Data.volumeInfo.imageLinks.thumbnail){
    this.img = Data.volumeInfo.imageLinks.thumbnail;}else{
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;}
}

//listening
server.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`);
})