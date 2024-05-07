import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToastContainer, toast } from "react-toastify";
import { BooksTableContainer } from "../styles/BooksTableContainer";
import { TextEditable } from "../components/TextEditable";
import { PopupAlertaDeletar } from "../components/PopupAlertaDeletar";
import { BookstoreService } from "../services/BookstoreService";
import { TablePaginationContainer } from "../styles/TablePaginationContainer";

export const Home = () => {
	// const [searchParams] = useSearchParams();
	// const order = searchParams.get('order');

	const [books,				setBooks]					= useState([]);
	const [alertaDeletar,		setAlertaDeletar]			= useState(false);
	const [bookAlertaDeletar,	setBookAlertaDeletar]		= useState();
	const [currentPage,			setCurrentPage]				= useState(0);
	const [rowsPerPage,			setRowsPerPage]				= useState(10);
	// const [totalPages,		setTotalPages]				= useState();
	const [totalElements,		setTotalElements]			= useState(0);
	const [searchTitle,			setSearchTitle]				= useState("");
	const [orderTitle,			setOrderTitle]				= useState("asc");

	const inputEditTitle		= useRef(null);
	const inputEditAuthor		= useRef(null);
	const inputEditCategory		= useRef(null);
	const inputEditLanguage		= useRef(null);
	const inputEditPrice		= useRef(null);
	const inputSearchTitle		= useRef(null);

	useEffect(() => {
		console.log("useEffect >", "searchTitle:", '"'+searchTitle+'"', "currentPage:", currentPage, " rowsPerPage:", rowsPerPage, "order:", orderTitle);
		fetchBooks();
	}, [currentPage, rowsPerPage, searchTitle, orderTitle])

	const fetchBooks = async () => {
		BookstoreService.getAllBooks(searchTitle, currentPage, rowsPerPage, orderTitle)
			.then((response) => {
				setBooks(response.content);
				// setTotalPages(response.totalPages)
				setTotalElements(response.totalElements)
			}).catch((error) => {
				toast.error(error, {
					position: "top-center",
					autoClose: 3000
				});
			});
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setCurrentPage(0);
	};

	const handleChangePage = (event, page) => {
		setCurrentPage(page)
	}

	const addBook = () => {
		let newTitle    = inputEditTitle.current.value    ? inputEditTitle.current.value.trim()    : null;
		let newAuthor   = inputEditAuthor.current.value   ? inputEditAuthor.current.value.trim()   : null;
		let newCategory = inputEditCategory.current.value ? inputEditCategory.current.value.trim() : null;
		let newLanguage = inputEditLanguage.current.value ? inputEditLanguage.current.value.trim() : null;
		let newPrice    = inputEditPrice.current.value    ? inputEditPrice.current.value.trim()    : null;

		if (!newTitle || !newAuthor || !newCategory || !newLanguage || !newPrice) {
			toast.error(`Preencher os campos obrigatórios!`, {
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
		};

		BookstoreService.addBook(newBook)
			.then(response => {
				toast.success(response, {
					position: "top-center",
					autoClose: 3000
				});
				fetchBooks();
				inputEditTitle.current.value    = "";
				inputEditAuthor.current.value   = "";
				inputEditCategory.current.value = "";
				inputEditLanguage.current.value = "";
				inputEditPrice.current.value    = "";
			}).catch((error) => {
				toast.error(error, {
					position: "top-center",
					autoClose: 3000
				});
			});
	};

	const buttonDeleteBook = (deleteBook) => {
		setAlertaDeletar(true);
		setBookAlertaDeletar(deleteBook);
	}

	const confirmDeleteBook = () => {
		BookstoreService.deleteBookById(bookAlertaDeletar.id)
			.then((response) => {
				toast.success(response, {
					position: "top-center",
					autoClose: 3000
				});
				fetchBooks();
			}).catch((error) => {
				toast.error(error, {
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

	const updateBook = (book) => {
		BookstoreService.updateBook(book)
			.then(response => {
				toast.success(response, {
					position: "top-center",
					autoClose: 3000
				});
				fetchBooks();
			}).catch((error) => {
				toast.error(error, {
					position: "top-center",
					autoClose: 3000
				});
			});
	}

	const searchBook = () => {
		let searchTitle = inputSearchTitle.current.value ? inputSearchTitle.current.value : "";
		setSearchTitle(searchTitle);
	}

	return (
		<main>
			<ToastContainer />
			<PopupAlertaDeletar
				open={alertaDeletar}
				onClose={() => setAlertaDeletar(false)}
				getPersistentElements={() => document.querySelectorAll(".Toastify")}
				bookTitle={bookAlertaDeletar?.title}
				onClick={() => confirmDeleteBook()}
			/>

			<BooksTableContainer striped hover>
				<thead>
					<tr>
						<td style={{ width: "5%" }}></td>
						<td style={{ width: "35%" }}>
							<InputGroup>
								<Form.Control
									type="text"
									placeholder="Title"
									ref={inputEditTitle}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "17%" }}>
							<InputGroup>
								<Form.Control
									type="text"
									placeholder="Author"
									ref={inputEditAuthor}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "15%" }}>
							<InputGroup>
								<Form.Control
									type="text"
									placeholder="Category"
									ref={inputEditCategory}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "11%" }}>
							<InputGroup>
								<Form.Control
									type="text"
									placeholder="Language"
									ref={inputEditLanguage}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "7%" }}>
							<InputGroup>
								<Form.Control
									type="number"
									placeholder="Price"
									ref={inputEditPrice}
								/>
							</InputGroup>
						</td>
						<td style={{ width: "10%", verticalAlign: "middle", textAlign: "center" }}>
							<Button variant="outline-success" size="sm" style={{ width: "100%", padding: "inherit" }} onClick={() => addBook()}>Add Book</Button>
						</td>
					</tr>
					<tr>
						<td style={{ width: "5%" }}></td>
						<td style={{ width: "35%" }}>
							<InputGroup>
								<Form.Control
									type="text"
									placeholder="Search Title"
									ref={inputSearchTitle}
								/>
							</InputGroup>
						</td>
						<td style={{ verticalAlign: "middle", textAlign: "center" }}>
							<Button variant="outline-secondary" size="sm" style={{ width: "100%", padding: "inherit" }} onClick={() => searchBook()}>Search</Button>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</thead>
				<thead>
					<tr style={{ verticalAlign: "middle"}}>
						<th>ID</th>
						<th style={{ display: "flex", alignItems: "center" }}>
							<div>Title</div>
							&nbsp;&nbsp;
							<div>
								<div style={{cursor: "pointer"}} onClick={() => setOrderTitle("desc")}>&#8593;</div>
								<div style={{cursor: "pointer"}} onClick={() => setOrderTitle("asc")}>&#8595;</div>
							</div>
						</th>
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
								<Button variant="outline-danger" size="sm" onClick={() => buttonDeleteBook(book)}>Delete</Button>
								&nbsp;
								<Button variant="outline-primary" size="sm" onClick={() => updateBook(book)}>Update</Button>
							</td>
						</tr>
					))}
				</tbody>
			</BooksTableContainer>

			<TablePaginationContainer
				component="div"
				count={totalElements}
				page={currentPage}
				onPageChange={(handleChangePage)}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={(handleChangeRowsPerPage)}
				showFirstButton
				showLastButton
			/>
			{/* <Pagination count={totalPages} onChange={(event, page) => setCurrentPage(page)} color="primary" variant="outlined" shape="rounded" size="small" /> */}

		</main >
	)
};