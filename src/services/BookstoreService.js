import { BookstoreApi } from "../api/BookstoreApi";

export class BookstoreService {

	static addBook(newBook) {
		return new Promise((resolve, reject) => {
			if (!newBook) {
				reject('Invalid Book!');
				return;
			}

			BookstoreApi.createBook(newBook)
				.then((response) => {
					let result = response.data.codigo;
					let message = response.data.mensagem;
					if (result == 1) {
						resolve(`Book '${newBook.title}' added successfully!`);
						return;
					} else {
						reject(`There was an error: ${message}`);
						return;
					}
				}).catch((error) => {
					reject(`There was an error: ${error.message}`);
					return;
				});
		});
	}

	static deleteBookById(id) {
		return new Promise((resolve, reject) => {
			if (!id) {
				reject('Invalid Book ID!');
				return;
			}

			BookstoreApi.deleteBookById(id)
				.then((response) => {
					let result = response.data.codigo;
					let message = response.data.mensagem;
					if (result == 1) {
						resolve(`Book ID '${id}' deleted successfully!`);
						return;
					} else {
						reject(`There was an error: ${message}`);
						return;
					}
				}).catch((error) => {
					reject(`There was an error: ${error.message}`);
					return;
				});
		});
	}

	static getAllBooks(title, order) {
		return new Promise((resolve, reject) => {
			BookstoreApi.getAllBooks(title, order)
				.then((response) => {
					let result = response.data.codigo;
					let message = response.data.mensagem;
					let bookArray = response.data.resultado;
					if (result == 1) {
						resolve(bookArray);
						return;
					} else {
						reject(`There was an error: ${message}`);
						return;
					}
				}).catch((error) => {
					reject(`There was an error: ${error.message}`);
					return;
				});
		});
	}

	static updateBookById(id, bookUpdate) {
		return new Promise((resolve, reject) => {
			if (!id) {
				reject('Invalid Book ID!');
				return;
			}
			if (!bookUpdate) {
				reject('Invalid Book!');
				return;
			}

			BookstoreApi.updateBookById(id, bookUpdate)
				.then((response) => {
					let result = response.data.codigo;
					let message = response.data.mensagem;
					if (result == 1) {
						resolve(`Book '${bookUpdate.title}' updated successfully!`);
						return;
					} else {
						reject(`There was an error: ${message}`);
						return;
					}
				}).catch((error) => {
					reject(`There was an error: ${error.message}`);
					return;
				});
		});
	}

}