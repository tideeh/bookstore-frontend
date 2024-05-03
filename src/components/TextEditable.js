export const TextEditable = ({value, onInput}) => (
	<div
		contentEditable
		suppressContentEditableWarning
		style={{ cursor: "url('pen.png'), auto" }}
		onInput={onInput}
	>
		{value}
	</div>
);