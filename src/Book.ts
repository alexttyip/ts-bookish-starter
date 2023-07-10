class Book {

    title:String;
    author:String;
    ISBN:String;
    copies:number;
    constructor(title: String, author: String, ISBN: String, copies: number) {
        this.title = title;
        this.author = author;
        this.ISBN = ISBN;
        this.copies = copies;
    }
}

export default Book