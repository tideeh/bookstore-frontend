import { useParams } from "react-router-dom"
import { BookstoreApi } from "../api/BookstoreApi";
import { useEffect, useState } from "react";

export const BookDetail = () => {
	const { id } = useParams();

	const [book, setBook] = useState([]);

	const fetchBook = async () => {
		const res = await BookstoreApi.getBookById(id);
		setBook(res.data.resultado);
		// console.log(res);
	}

	useEffect(() => {
		fetchBook();
	}, []);

	return (
		<main>
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