import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/v1/books';

const withBaseUrl = path => `${BASE_URL}${path}`;

export class BookstoreApi {

	static getBookById(id) {
		return axios(withBaseUrl(`/${id}`));
	}

	static getAllBooks(title, page, size, order) {
		let path = '?title='+(title ? title : '')+'&page='+(page ? page : '')+'&size='+(size ? size : '')+'&order='+(order ? order : '');
		let url = withBaseUrl(path);
		// console.log(url);
		return axios(url);
	}

	static deleteBookById(id) {
		return axios.delete(withBaseUrl(`/${id}`));
	}

	static createBook(newBook) {
		return axios.post(withBaseUrl(``), newBook);
	}

	static updateBook(book) {
		return axios.put(withBaseUrl(``), book);
	}
	
};