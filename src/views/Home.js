import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from "react-toastify";
import { Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import { BookstoreApi } from "../api/BookstoreApi";
import { LinkWithoutDecoration } from "../styles/LinkWithoutDecoration";
import { BooksTableContainer } from "../styles/BooksTableContainer";
import "../styles/alertaConfirmacao.css";

export const Home = () => {
	const [searchParams] = useSearchParams();
	const title = searchParams.get('title');

	const [books, setBooks] = useState([]);

	const fetchBooks = async () => {
		const res = await BookstoreApi.getAllBooks(title);
		// console.log(res);
		setBooks(res.data.resultado);
	}

	useEffect(() => {
		fetchBooks();
	}, []);

	const [alertaDeletar, setAlertaDeletar] = useState(false);
	const [bookAlertaDeletar, setBookAlertaDeletar] = useState();

	const deleteBook = (book) => {
		setAlertaDeletar(true);
		setBookAlertaDeletar(book);
	}

	const confirmDeleteBook = () => {
		BookstoreApi.deleteBookById(bookAlertaDeletar.id)
			.then(() => {
				console.log("deleted book id: " + bookAlertaDeletar.id);
				toast.success(`Book '${bookAlertaDeletar.title}' deleted successfully`, {
					position: "top-center",
					autoClose: 3000
				});
				fetchBooks();
				setAlertaDeletar(false);
			}).catch((error) => {
				console.log("error deleting book id: " + bookAlertaDeletar.id);
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
							<td><Button variant="outline-danger" size="sm" onClick={() => deleteBook(book)}>Deletar</Button></td>
						</tr>
					))}
				</tbody>
			</BooksTableContainer>
		</main>
	)
};