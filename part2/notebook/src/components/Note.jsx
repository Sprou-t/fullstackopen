const Note = ({ note, toggleImportance }) => {
	const label = note.important ? "make not important" : "make important";
// can use className to access the component in the test
	return (
	<li className='note'>
      Your awesome note: {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
	);
};

export default Note	