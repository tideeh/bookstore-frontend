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

export const Home = () => {
	const [searchParams] = useSearchParams();
	const title = searchParams.get('title');
	const order = searchParams.get('order');

	const [books, setBooks] = useState([]);
	const fetchBooks = async () => {
		BookstoreApi.getAllBooks(title, order)
			.then((response) => {
				let result = response.data.codigo;
				let message = response.data.mensagem;
				if (result == 1) {
					setBooks(res.data.resultado);
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
	useEffect(() => {
		fetchBooks();
	}, []);

	const [alertaDeletar, setAlertaDeletar] = useState(false);
	const [bookAlertaDeletar, setBookAlertaDeletar] = useState();

	const inputTiteRef		= useRef(null);
	const inputAuthorRef	= useRef(null);
	const inputCategoryRef	= useRef(null);

	const addBook = () => {
		let newTitle		= inputTiteRef.current.value ? inputTiteRef.current.value.trim() : null;
		let newAuthor		= inputAuthorRef.current.value ? inputAuthorRef.current.value.trim() : null;
		let newCategory		= inputCategoryRef.current.value ? inputCategoryRef.current.value.trim() : null;
		if(!newTitle || !newAuthor || !newCategory) {
			toast.error(`Preencher os campos obrigatórios`, {
				position: "top-center",
				autoClose: 3000
			});
			return;
		}

		let newBook = {
			title:		newTitle,
			author:		newAuthor,
			category:	newCategory
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
					inputTiteRef.current.value		= "";
					inputAuthorRef.current.value	= "";
					inputCategoryRef.current.value	= "";
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

	const deleteBook = (book) => {
		setAlertaDeletar(true);
		setBookAlertaDeletar(book);
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
						<td style={{ width: "45%" }}>
							<InputGroup hasValidation className="mb-3">
								<Form.Control
									type="text"
									placeholder="Title"
									ref={inputTiteRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "25%" }}>
							<InputGroup className="mb-3">
								<Form.Control
									type="text"
									placeholder="Author"
									ref={inputAuthorRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "10%" }}>
							<InputGroup className="mb-3">
								<Form.Control
									type="text"
									placeholder="Category"
									ref={inputCategoryRef}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "15%", verticalAlign: "top", textAlign: "center" }}>
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
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{books.map(book => (
						<tr key={book.id}>
							<td><Link to={`/book/${book.id}`}>{book.id}</Link></td>
							<td><LinkWithoutDecoration to={`/book/${book.id}`}>{book.title}</LinkWithoutDecoration></td>
							<td>{book.author}</td>
							<td>{book.category}</td>
							<td>
								<Button variant="outline-danger" size="sm" onClick={() => deleteBook(book)}>Delete</Button>
								&nbsp;
								<Button variant="outline-primary" size="sm" onClick={() => deleteBook(book)}>Update</Button>
							</td>
						</tr>
					))}
				</tbody>
			</BooksTableContainer>

		</main >
	)
};