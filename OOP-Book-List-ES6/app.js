// Create book class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// Create UI class
class UI {

  // Add book to list
  addBookToList(book) {
    const list = document.getElementById('book-list');

    const row = document.createElement('tr');
    row.innerHTML = `     
    <td>${book.title}</td>  
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">x</a></td>
    `;

    list.appendChild(row);
  }

  // Delete book from list
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  // Clear books from list
  clearBooks() {
    const list = document.getElementById('book-list');

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  // Clear all input fields
  clearFields() {
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('book-isbn').value = '';
  }

  // Create message from event
  createMessage(messageHeader, messageBody, type) {
    const message = document.createElement('article');
    const container = document.querySelector('.container');
    const form = document.getElementById('book-form');

    message.className = `message is-${type}`;
    message.innerHTML = `
    <div class="message-header">
      <p>${messageHeader}</p>
    </div>
    <div class="message-body">
      ${messageBody}
    </div>
    `;

    container.insertBefore(message, form);

    setTimeout(function () {
      document.querySelector('.message').remove();
    }, 3000);
  }
}

// Functions are static so we can call them without instantiating
class StoreLocal {
  static getBooks() {
    let books;

    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = StoreLocal.getBooks();

    books.forEach(book => {
      const ui = new UI;
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = StoreLocal.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = StoreLocal.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

  static clearBooks() {
    localStorage.clear();
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', StoreLocal.displayBooks);

// Event listener for adding books
document.getElementById('book-form').addEventListener('submit', function (e) {

  const ui = new UI();

  const title = document.getElementById('book-title').value,
    author = document.getElementById('book-author').value,
    isbn = document.getElementById('book-isbn').value;

  if (title === '' || author === '' || isbn === '') {
    ui.createMessage('Warning', 'Please fill in all fields', 'warning');
  } else {
    ui.createMessage('Success!', 'Book inserted to list successfully', 'success');
    const book = new Book(title, author, isbn);
    ui.addBookToList(book);
    
    StoreLocal.addBook(book);

    ui.clearFields();
  }

  e.preventDefault();
});

// Event listener for clear books
document.getElementById('book-form').addEventListener('reset', function (e) {const ui = new UI();
    //This checks if table is empty
    const isEmpty = document.querySelectorAll("tr").length <= 1;

    //If table is empty, don't allow clear
    if (isEmpty) {
      ui.createMessage('Warning', "Can't clear an empty book list", 'warning');
    } else {
      if (confirm('Are you sure you want to clear all your tasks?')) {
        ui.clearBooks();

        StoreLocal.clearBooks();

        ui.createMessage('Success!', 'All books cleared.', 'success');
      }
    }
})

// Event listener for deleting books
document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();

  ui.deleteBook(e.target);

  // Try and get ISBN# of current book to compare local storage entry
  StoreLocal.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
  ui.createMessage('Success!', 'Book was deleted successfully, with grace.', 'success');
})

