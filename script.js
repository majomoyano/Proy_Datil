
let usuarioActual = null;
let booksL = [];

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        usuarioActual = 'admin';
        showAdminPanel();
    } else if (username.startsWith('estudiante') && password === 'estudiante') {
        usuarioActual = 'estudiante';
        showStudentPanel();
    } else {
        alert('Las credenciales son incorrectas');
    }
}

function showAdminPanel() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
}

function showStudentPanel() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('student-panel').classList.remove('hidden');
}

function logout() {
    usuarioActual = null;
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('student-panel').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
}

function showAddBookForm() {
    document.getElementById('add-book-form').classList.remove('hidden');
}

function hideAddBookForm() {
    document.getElementById('add-book-form').classList.add('hidden');
}

function addBook() {
    const code = document.getElementById('book-code').value;
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const quantity = parseInt(document.getElementById('book-quantity').value);

    const existingBook = booksL.find(book => book.code === code);

    if (existingBook) {
        existingBook.quantity += quantity;
    } else {
        booksL.push({
            code,
            title,
            author,
            quantity
        });
    }

    hideAddBookForm();
}


function searchBook() {
    const code = prompt('Ingrese el código del libro a buscar:');
    const book = booksL.find(book => book.code === code);

    if (book) {
        alert(`Información del libro:\nCódigo: ${book.code}\nTítulo: ${book.title}\nAutor: ${book.author}\nCantidad Disponible: ${book.quantity}`);
    } else {
        alert('Libro no encontrado.');
    }
}



function showAvailablebooksL() {
    console.log("Botón clicado"); 
    const availablebooksL = booksL.filter(book => book.quantity > 0);

    if (availablebooksL.length === 0) {
        alert('No hay libros disponibles en este momento.');
    } else {
        let bookList = 'Libros Disponibles:\n';

        availablebooksL.forEach(book => {
            bookList += `Código: ${book.code}, Título: ${book.title}, Autor: ${book.author}, Cantidad Disponible: ${book.quantity}\n`;
        });

        alert(bookList);

        
        const option = prompt('Ingrese el código del libro que desea prestar (o presione Cancelar para salir):');

        if (option !== null) {
            borrowBook(option);
        }
    }
}




function showBorrowedbooksL() {
    const studentbooksL = booksL.filter(book => book.borrowedBy === usuarioActual);

    if (studentbooksL.length === 0) {
        alert('No tienes libros prestados en este momento.');
    } else {
        let bookList = 'Libros Prestados:\n';
        studentbooksL.forEach(book => {
            bookList += `Título: ${book.title}, Autor: ${book.author}, Fecha de Emisión: ${book.issueDate}, Fecha de Devolución: ${book.returnDate}\n`;
        });
        alert(bookList);
    }
}


function borrowBook() {
    const code = prompt('Ingrese el código del libro que desea prestar:');
    const selectedBook = booksL.find(book => book.code === code);

    if (selectedBook && selectedBook.quantity > 0 && !hasBookBorrowed(usuarioActual, selectedBook.title)) {
        const confirmBorrow = confirm(`¿Desea confirmar el préstamo del libro ${selectedBook.title}?`);
        if (confirmBorrow) {
            selectedBook.quantity--;
            selectedBook.borrowedBy = usuarioActual;
            selectedBook.issueDate = getCurrentDate();
            selectedBook.returnDate = calculateReturnDate(selectedBook.issueDate);
            alert(`Libro prestado exitosamente. Fecha de devolución: ${selectedBook.returnDate}`);
        }
    } else if (!selectedBook) {
        alert('Libro no encontrado.');
    } else if (selectedBook.quantity === 0) {
        alert('El libro no está disponible en este momento.');
    } else if (hasBookBorrowed(usuarioActual, selectedBook.title)) {
        alert('No puedes prestar más de un ejemplar del mismo código.');
    }
}


function hasBookBorrowed(estudiante, title) {
    return booksL.some(book => book.borrowedBy === estudiante && book.title === title);
}


function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function calculateReturnDate(issueDate) {
    const returnDate = new Date(issueDate);
    returnDate.setDate(returnDate.getDate() + 31);
    const year = returnDate.getFullYear();
    const month = String(returnDate.getMonth() + 1).padStart(2, '0');
    const day = String(returnDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
