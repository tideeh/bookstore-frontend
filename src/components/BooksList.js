import { BookItem } from "./BookItem";

export const BooksList = ({ books }) => (
	<ul>
		{books.map(b => <BookItem book={b}/>)}
	</ul>
);