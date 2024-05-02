import { Link } from "react-router-dom";

export const BookItem = ({ book }) => (
	<li>
		<Link to={`/book/${book.id}`}>{book.title}</Link>
	</li>
);