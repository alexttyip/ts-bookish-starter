import { Request, Response, Router } from 'express';
import Book from "../Book";

const router = Router();
// const bodyParser = require('body-parser')


router.get('/:id', function getBook(req: Request, res: Response) {
    // TODO: implement functionality
    const sql = require("mssql");

    // config for your database
    const config = {
        user: 'SA',
        password: 'Abcd1234?',
        server: 'localhost',
        database: 'bookish',
        trustServerCertificate: true,
    };

    let bookArray = [];
    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        let request = new sql.Request();

        // query to the database and get the records
        request.query('select book.title, book.isbn, author.name as author, COUNT(book_instance.isbn) as copies from book, book_author, author, book_instance where  book.isbn = book_author.isbn and book_author.author_id = author.id and book_instance.isbn = book.isbn group by book.title, book.isbn, author.name', function (err, records) {

            if (err) console.log(err)

            // send records as a response

            let recordsArray = records['recordsets'][0]
            for (let result of recordsArray) {
                let bookResult = new Book(result.title, result.author, result.isbn, result.copies);
                bookArray.push(bookResult);
            }
            const booksJSON = JSON.stringify(bookArray);
            console.log(typeof req.params.id, req.params.id)
            let bookRequestId:number = +(req.params.id);
            if (bookRequestId < bookArray.length) {
                return res.status(200).json(JSON.stringify(bookArray[bookRequestId]))
            }
            return res.status(500).json({
                error: 'server_error',
                error_description: `Endpoint not implemented yet.`,
            });
        });
    });
});

router.get('/', function getBooks(req: Request, res: Response) {
    // TODO: implement functionality
    const sql = require("mssql");

    // config for your database
    const config = {
        user: 'SA',
        password: 'Abcd1234?',
        server: 'localhost',
        database: 'bookish',
        trustServerCertificate: true,
    };

    let bookArray = [];
    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        let request = new sql.Request();

        // query to the database and get the records
        request.query('select book.title, book.isbn, author.name as author, COUNT(book_instance.isbn) as copies from book, book_author, author, book_instance where  book.isbn = book_author.isbn and book_author.author_id = author.id and book_instance.isbn = book.isbn group by book.title, book.isbn, author.name', function (err, records) {

            if (err) console.log(err)

            // send records as a response

            let recordsArray = records['recordsets'][0]
            for (let result of recordsArray) {
                let bookResult = new Book(result.title, result.author, result.isbn, result.copies);
                bookArray.push(bookResult);
            }
            return res.status(200).json(JSON.stringify(bookArray));
            return res.status(500).json({
                error: 'server_error',
                error_description: `Endpoint not implemented yet.`,
            });
        });
    });
});
router.post('/', function createBook(req: Request, res: Response) {
    // TODO: implement functionality
    let data = req.body;
    let newBook = new Book(data.title, data.author, data.ISBN, 1);
    const sql = require("mssql");

    // config for your database
    const config = {
        user: 'SA',
        password: 'Abcd1234?',
        server: 'localhost',
        database: 'bookish',
        trustServerCertificate: true,
    };

    let bookArray = [];
    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        let request = new sql.Request();

        // query to the database and get the records
        let sqlQ = `insert into book values(\'${newBook.ISBN}\', \'${newBook.title}\'); insert into author (name) values(\'${newBook.author}\'); insert into book_instance (isbn) values(\'${newBook.ISBN}\'); DECLARE @TestVariable as int; SELECT @TestVariable =  (select id from author where name = \'${newBook.author}\'); insert into book_author (isbn, author_id) values(\'${newBook.ISBN}\', @TestVariable);`
        request.query(sqlQ, function (err, records) {

        });
    });
    res.send("newBook received")

});


export default router;
