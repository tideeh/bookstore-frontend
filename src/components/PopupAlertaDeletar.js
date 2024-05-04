import { Dialog, DialogDismiss, DialogHeading } from "@ariakit/react";
import Button from 'react-bootstrap/Button';
import "../styles/popupAlertaDeletar.css";

export const PopupAlertaDeletar = ({open, onClose, getPersistentElements, bookTitle, onClick}) => (
	<Dialog
		open={open}
		onClose={onClose}
		getPersistentElements={getPersistentElements}
		backdrop={<div className="backdrop" />}
		className="dialog"
	>
		<DialogHeading className="heading">Confirmar</DialogHeading>
		<p className="description">
			Deseja realmente deletar o livro '{bookTitle}'?
		</p>
		<div className="buttons">
			<Button variant="outline-success" onClick={onClick}>
				Confirmar
			</Button>
			<DialogDismiss className="button secondary">Cancel</DialogDismiss>
		</div>
	</Dialog>
);