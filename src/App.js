import { Header } from "./components/Header";
import { About } from "./views/About";
import { Home } from "./views/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BookDetail } from "./views/BookDetail";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Header/>

				<Routes>
					<Route path="/about" element={<About/>} />
					<Route path="/" element={<Home/>} />
					<Route path="/book/:id" element={<BookDetail/>} />
				</Routes>

			</BrowserRouter>
		</div>
	);
}

export default App;