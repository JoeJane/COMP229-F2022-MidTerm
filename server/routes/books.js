// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    // create empty book model
    let emptyBook = book({
        "Title": '',
        "Description": '',
        "Price": '',
        "Author": '',
        "Genre": ''
    });

    // render add book page using empty book model
    res.render('books/details', {title: 'Add Book', books: emptyBook});

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    // create new book model to insert to DB
    let newBook = book({
        "Title": req.body.title,
        //"Description": req.body.Description,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre
    });

    // insert new book model to DB
    book.create(newBook, (err, book) => {
        if(err){
            console.log("Error while creating book: " + err);
            next(err) // if error, show error page
        } else {
            // refresh the books list
            res.redirect('/books');
        }
    });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    // get the book id from the request
    let id = req.params.id;

    // get the book from the DB based on book id
    book.findById(id, (err, bookToEdit) => {
        if(err){
            console.log("Error while getting book: " + err);
            next(err) // if error show error page
        } else {
            // render the edit book view 
            res.render('books/details', {title: 'Edit Books', books: bookToEdit });
        }
    });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    // get the book id from the request
    let id = req.params.id;

    // create updated book model
    let updatedBook = book({
        "_id": id,
        "Title": req.body.title,
        //"Description": req.body.Description,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre
    });

    // update the book based on the book id
    book.updateOne({_id: id}, updatedBook, (err) => {
        if(err){
            console.log("Error while updating book: " + err);
            next(err) // if error, show error page
        } else {
            // refresh the books list
            res.redirect('/books');
        }
    });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    // get the book id from the request
    let id = req.params.id;

    // remove the book based on the book id
    book.remove({_id: id}, (err) => {
        if(err){
            console.log("Error while deleting book: " + err);
            next(err) // if error, show error page
        } else {
            // refresh the books list
            res.redirect('/books');
        }
    });
});


module.exports = router;
