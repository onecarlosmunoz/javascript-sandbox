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
  addBookToList(book) {
    const list = document.getElementById('book-list');

    // Create tr element
    const row = document.createElement('tr');
    row.innerHTML = `     
    <td>${book.title}</td>  
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">x</a></td>
    `;

    list.appendChild(row);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearBooks() {
    const list = document.getElementById('book-list');

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  clearFields() {
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('book-isbn').value = '';
  }

  createMessage(messageHeader, messageBody, type) {
    const message = document.createElement('article');
    const container = document.querySelector('.container');
    const form = document.getElementById('book-form');

    // if error
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

// Event listener for adding a book
document.getElementById('book-form').addEventListener('submit', function (e) {

  const ui = new UI();

  // Get form values
  const title = document.getElementById('book-title').value,
    author = document.getElementById('book-author').value,
    isbn = document.getElementById('book-isbn').value;

  if (title === '' || author === '' || isbn === '') {
    ui.createMessage('Warning', 'Please fill in all fields', 'warning');
  } else {
    ui.createMessage('Success!', 'Book inserted to list successfully', 'success');
    const book = new Book(title, author, isbn);
    ui.addBookToList(book);
    ui.clearFields();
  }

  e.preventDefault();
});

document.getElementById('book-form').addEventListener('reset', function (e) {
  console.log('ite');

  const ui = new UI();
  
  if (confirm('Are you sure you want to clear all your tasks?')) {
    ui.clearBooks();
    ui.createMessage('Success!', 'All books cleared.', 'success');
  }
})

// Event listener for deleting a Book
document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();
  ui.deleteBook(e.target);

  ui.createMessage('Success!', 'Book was deleted successfully, with grace.', 'success');
})
