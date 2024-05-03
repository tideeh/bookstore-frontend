import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToastContainer, toast } from "react-toastify";
import { Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import { BookstoreApi } from "../api/BookstoreApi";
import { LinkWithoutDecoration } from "../styles/LinkWithoutDecoration";
import { BooksTableContainer } from "../styles/BooksTableContainer";
import "../styles/alertaConfirmacao.css";
import { TextEditable } from "../components/TextEditable";

export const Home = () => {
	const [searchParams] = useSearchParams();
	const title = searchParams.get('title');
	const order = searchParams.get('order');

	const [books, setBooks] = useState([]);
	const [alertaDeletar, setAlertaDeletar] = useState(false);
	const [bookAlertaDeletar, setBookAlertaDeletar] = useState();

	const inputTiteRef     = useRef(null);
	const inputAuthorRef   = useRef(null);
	const inputCategoryRef = useRef(null);
	const inputLanguageRef = useRef(null);
	const inputPriceRef    = useRef(null);

	useEffect(() => {
		fetchBooks();
	}, []);

	const fetchBooks = async () => {
		BookstoreApi.getAllBooks(title, order)
			.then((response) => {
				let result = response.data.codigo;
				let message = response.data.mensagem;
				let bookArray = response.data.resultado;
				if (result == 1) {
					setBooks(bookArray);
				} else {
					toast.error(`There was an error: ${message}`, {
						position: "top-center",
						autoClose: 3000
					});
				}
			}).catch((error) => {
				toast.error(`There was an error: ${error.message}`, {
					position: "top-center",
					autoClose: 3000
				});
			});
	}

	const addBook = () => {
		let newTitle = inputTiteRef.current.value        ? inputTiteRef.current.value.trim()     : null;
		let newAuthor = inputAuthorRef.current.value     ? inputAuthorRef.current.value.trim()   : null;
		let newCategory = inputCategoryRef.current.value ? inputCategoryRef.current.value.trim() : null;
		let newLanguage = inputLanguageRef.current.value ? inputLanguageRef.current.value.trim() : null;
		let newPrice = inputPriceRef.current.value       ? inputPriceRef.current.value.trim()    : null;
		if (!newTitle || !newAuthor || !newCategory || !newLanguage || !newPrice) {
			toast.error(`Preencher os campos obrigatórios`, {
				position: "top-center",
				autoClose: 3000
			});
			return;
		}

		let newBook = {
			title: newTitle,
			author: newAuthor,
			category: newCategory,
			language: newLanguage,
			price: newPrice
		}
		// console.log(newBook);

		BookstoreApi.createBook(newBook)
			.then((response) => {
				let result = response.data.codigo;
				let message = response.data.mensagem;
				if (result == 1) {
					toast.success(`Book '${newBook.title}' added successfully`, {
						position: "top-center",
						autoClose: 3000
					});
					fetchBooks();
					inputTiteRef.current.value     = "";
					inputAuthorRef.current.value   = "";
					inputCategoryRef.current.value = "";
					inputLanguageRef.current.value = "";
					inputPriceRef.current.value    = "";
				} else {
					toast.error(`There was an error: ${message}`, {
						position: "top-center",
						autoClose: 3000
					});
				}
			}).catch((error) => {
				toast.error(`There was an error: ${error.message}`, {
					position: "top-center",
					autoClose: 3000
				});
			});
	}

	const deleteBook = (deleteBook) => {
		setAlertaDeletar(true);
		setBookAlertaDeletar(deleteBook);
	}

	const confirmDeleteBook = () => {
		BookstoreApi.deleteBookById(bookAlertaDeletar.id)
			.then((response) => {
				let result = response.data.codigo;
				let message = response.data.mensagem;
				if (result == 1) {
					toast.success(`Book '${bookAlertaDeletar.title}' deleted successfully`, {
						position: "top-center",
						autoClose: 3000
					});
					fetchBooks();
				} else {
					toast.error(`There was an error: ${message}`, {
						position: "top-center",
						autoClose: 3000
					});
				}
			}).catch((error) => {
				toast.error(`There was an error: ${error.message}`, {
					position: "top-center",
					autoClose: 3000
				});
			}).finally(() => {
				setAlertaDeletar(false);
			});
	}

	const onEditHandler = (id, key, newValue) => {
		let bookEditing = books.find((book, index) => {
			if (book.id === id) {
				books[index][key] = newValue;
				return true;
			}
		});
	}

	const updateBook = (id) => {
		let bookUpdate = books.find(book => book.id === id);
		BookstoreApi.updateBookById(id, bookUpdate)
			.then((response) => {
				let result = response.data.codigo;
				let message = response.data.mensagem;
				if (result == 1) {
					toast.success(`Book '${bookUpdate.title}' updated successfully`, {
						position: "top-center",
						autoClose: 3000
					});
					fetchBooks();
				} else {
					toast.error(`There was an error: ${message}`, {
						position: "top-center",
						autoClose: 3000
					});
				}
			}).catch((error) => {
				toast.error(`There was an error: ${error.message}`, {
					position: "top-center",
					autoClose: 3000
				});
			});
	}

	const AlertaConfirmacao = () => (
		<Dialog
			open={alertaDeletar}
			onClose={() => setAlertaDeletar(false)}
			getPersistentElements={() => document.querySelectorAll(".Toastify")}
			backdrop={<div className="backdrop" />}
			className="dialog"
		>
			<DialogHeading className="heading">Confirmar</DialogHeading>
			<p className="description">
				Deseja realmente deletar o livro '{bookAlertaDeletar?.title}'?
			</p>
			<div className="buttons">
				<Button variant="outline-success" onClick={() => confirmDeleteBook()}>
					Confirmar
				</Button>
				<DialogDismiss className="button secondary">Cancel</DialogDismiss>
			</div>
		</Dialog>
	);

	return (
		<main>
			<ToastContainer />
			<AlertaConfirmacao />

			<BooksTableContainer striped hover>
				<thead>
					<tr>
						<td style={{ width: "5%" }}></td>
						<td style={{ width: "35%" }}>
							<InputGroup hasValidation className="mb-3">
								<Form.Control
									type="text"
									placeholder="Title"
									ref={inputTiteRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "17%" }}>
							<InputGroup className="mb-3">
								<Form.Control
									type="text"
									placeholder="Author"
									ref={inputAuthorRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "15%" }}>
							<InputGroup className="mb-3">
								<Form.Control
									type="text"
									placeholder="Category"
									ref={inputCategoryRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "11%" }}>
							<InputGroup className="mb-3">
								<Form.Control
									type="text"
									placeholder="Language"
									ref={inputLanguageRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "7%" }}>
							<InputGroup className="mb-3">
								<Form.Control
									type="number"
									placeholder="Price"
									ref={inputPriceRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "10%", verticalAlign: "top", textAlign: "center" }}>
							<Button variant="outline-success" size="sm" style={{ width: "100%", padding: "inherit" }} onClick={() => addBook()}>Add Book</Button>
						</td>
					</tr>
				</thead>
				<thead>
					<tr>
						<th>ID</th>
						<th>Title</th>
						<th>Author</th>
						<th>Category</th>
						<th>Language</th>
						<th>Price</th>
						<th style={{ textAlign: "center" }}>Action</th>
					</tr>
				</thead>
				<tbody>
					{books.map(book => (
						<tr key={book.id}>
							<td><Link to={`/book/${book.id}`}>{book.id}</Link></td>
							<td><TextEditable value={book.title}    onInput={(input) => onEditHandler(book.id, "title",    input.currentTarget.textContent)} /></td>
							<td><TextEditable value={book.author}   onInput={(input) => onEditHandler(book.id, "author",   input.currentTarget.textContent)} /></td>
							<td><TextEditable value={book.category} onInput={(input) => onEditHandler(book.id, "category", input.currentTarget.textContent)} /></td>
							<td><TextEditable value={book.language} onInput={(input) => onEditHandler(book.id, "language", input.currentTarget.textContent)} /></td>
							<td><TextEditable value={book.price}    onInput={(input) => onEditHandler(book.id, "price",    input.currentTarget.textContent)} /></td>
							<td style={{ textAlign: "center" }}>
								<Button variant="outline-danger" size="sm" onClick={() => deleteBook(book)}>Delete</Button>
								&nbsp;
								<Button variant="outline-primary" size="sm" onClick={() => updateBook(book.id)}>Update</Button>
							</td>
						</tr>
					))}
				</tbody>
			</BooksTableContainer>

		</main >
	)
};