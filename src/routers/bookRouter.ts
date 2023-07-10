import { Request, Response, Router } from 'express';
import { Request as SqlRequest, Connection } from 'tedious';

const router = Router();

function createDBConnection() {
    const config = {
        server: 'localhost',
        options: {
            trustServerCertificate: true,
            database: 'bookish',
        },
        authentication: {
            type: 'default',
            options: {
                userName: 'SA',
                password: 'Abcd1234?',
            },
        },
    };

    const connection = new Connection(config);

    connection.on('connect', function (err) {
        if (err) {
            console.log('Error: ', err);
        } else {
            console.log('HOORAY!');
        }
    });

    connection.connect();
    return connection;
}

const connection = createDBConnection();

class Book {
    constructor(isbn: string, name: string, author: string) {
        this.isbn = isbn;
        this.name = name;
        this.author = author;
    }

    isbn: string;
    name: string;
    author: string;
}

router.get('/:id', function getBook(req: Request, res: Response) {
    const id = req.params.id;

    const request = new SqlRequest(
        `select * from book where isbn='${id}'`,
        (err, rowCount) => {
            if (err) {
                console.log(err);
            } else {
                console.log(rowCount + ' rows');
            }
        },
    );

    request.on('row', function (columns) {
        return res.status(200).json(getBookFromDatabaseRow(columns));
    });

    connection.execSql(request);
});

function getBookFromDatabaseRow(row) {
    return new Book(row[0].value, row[1].value, row[2].value);
}

router.get('/', function getAll(req: Request, res: Response) {
    const books: Book[] = [];
    const request = new SqlRequest(
        `SELECT book.isbn, book.title, string_agg(author.name, ', ') FROM book LEFT JOIN book_author ON book.isbn = book_author.isbn LEFT JOIN author ON book_author.author_id = author.id GROUP BY book.isbn, book.title`,
        (err, rowCount) => {
            if (err) {
                console.log(err);
            } else {
                console.log(rowCount + ' rows');
                return res.status(200).json(books);
            }
        },
    );

    request.on('row', function (columns) {
        books.push(getBookFromDatabaseRow(columns));
    });

    connection.execSql(request);
});

router.post('/', function createBook(req: Request, res: Response) {
    const bookData = req.body;

    const request = new SqlRequest(
        `INSERT INTO book VALUES ('${bookData.isbn}', '${bookData.name}')`,
        (err, rowCount, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err.body);
            } else {
                return res.status(201).json(rows);
            }
        },
    );

    connection.execSql(request);
});

export default router;
