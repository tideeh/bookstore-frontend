import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BooksContainer } from "../styles/BooksContainer";
import { BookstoreApi } from "../api/BookstoreApi";
import { BooksList } from "../components/BooksList";

export const Home = () => {
	const [ searchParams ] = useSearchParams();
	const title = searchParams.get('title');

	const [books, setBooks] = useState([]);

	const fetchBooks = async () => {
		const res = await BookstoreApi.getAllBooks(title);
		console.log(res);
		setBooks(res.data.resultado);
	}

	useEffect(() => {
		fetchBooks();
	}, []);

	return (
		<BooksContainer>
			<BooksList books={books} />
		</BooksContainer>
	)
};