import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify";
import { BookstoreApi } from "../api/BookstoreApi";

export const BookDetail = () => {
	const { id } = useParams();

	const [book, setBook] = useState([]);

	useEffect(() => {
		fetchBook();
	}, []);

	const fetchBook = async () => {
		BookstoreApi.getBookById(id)
			.then((response) => {
				let result = response.data.codigo;
				let message = response.data.mensagem;
				let book = response.data.resultado;
				if (result == 1) {
					setBook(book);
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

	return (
		<main>
			<ToastContainer />
			<h1>{book.title}</h1>
			
			<article>
				Author: {book.author}
			</article>

			<article>
				Category: {book.category}
			</article>

			<article>
				Price: $ {book.price}
			</article>
		</main>
	)
}