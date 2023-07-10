import {Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes} from 'sequelize';
import {Request, Response, Router} from "express";
import Book from "../Book";
const sequelize = new Sequelize('bookish', 'SA', 'Abcd1234?', {
    host: 'localhost',
    dialect: 'mssql',
    define: {
        timestamps: false,
        freezeTableName: true,
    },
});

class book extends Model<InferAttributes<book>, InferCreationAttributes<book>> {
// = sequelize.define('book', {
     isbn: string;
     title: string;
}
book.init({
    isbn: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    title: DataTypes.STRING,
}, { sequelize })

const BookAuthorTable = sequelize.define('book_author', {
    isbn: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
});

const AuthorTable = sequelize.define('author', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
    } ,
    name: DataTypes.STRING,
});

const BookInstance = sequelize.define('book_instance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    isbn: DataTypes.STRING,
});

const router = Router();

router.post('/', async function createBook(req: Request, res: Response) {
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
    // console.log(req.body);
    const book1y = await book.create({isbn: String(newBook.ISBN), title: String(newBook.title)});
    console.log("Jimmy's auto-generated ID:", book1y.title);
    const b = await book.findAll();


    //console.log(b);
    res.send("newBook received")

});

export default router