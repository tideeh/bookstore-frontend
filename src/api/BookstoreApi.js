import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/v1/books';

const withBaseUrl = path => `${BASE_URL}${path}`;

export class BookstoreApi {

	static getBookById(id) {
		return axios(withBaseUrl(`/${id}`));
	}

	static getAllBooks(title, order) {
		let path = '?title='+(title ? title : '')+'&order='+(order ? order : '');
		let url = withBaseUrl(path);
		console.log(url);
		return axios(url);
	}

	static deleteBookById(id) {
		return axios.delete(withBaseUrl(`/${id}`));
	}

	static createBook(newBook) {
		return axios.post(withBaseUrl(``), newBook);
	}
	
};