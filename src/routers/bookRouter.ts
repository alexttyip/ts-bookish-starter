import { Request, Response, Router } from 'express';
import { Request as SqlRequest, Connection } from 'tedious';

const router = Router();

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
    // If no error, then good to go...
});

// Initialize the connection.
connection.connect();

class Book {
    constructor(isbn: string, name: string) {
        this.isbn = isbn;
        this.name = name;
    }

    isbn: string;
    name: string;
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
        console.log(columns);
        return res.status(200).json(getBookFromDatabaseRow(columns));
    });

    connection.execSql(request);
});

function getBookFromDatabaseRow(row) {
    return new Book(row[0].value, row[1].value);
}

router.get('/', function getAll(req: Request, res: Response) {
    const books: Book[] = [];
    const request = new SqlRequest('select * from book', (err, rowCount) => {
        if (err) {
            console.log(err);
        } else {
            console.log(rowCount + ' rows');
            return res.status(200).json(books);
        }
    });

    request.on('row', function (columns) {
        console.log(columns);
        books.push(getBookFromDatabaseRow(columns));
    });

    connection.execSql(request);
});

router.post('/', function createBook(req: Request, res: Response) {
    // TODO: implement functionality
    return res.status(500).json({
        error: 'server_error',
        error_description: 'Endpoint not implemented yet.',
    });
});

export default router;
