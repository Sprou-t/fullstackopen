import { useState } from "react";

// PhoneForm Component
const PhoneForm = ({
	newName,
	newNum,
	handleNameChange,
	handleNumChange,
	addPhoneName,
}) => {
	return (
		<form onSubmit={addPhoneName}>
			<div>
				name: <input value={newName} onChange={handleNameChange} />
			</div>
			<div>
				number: <input value={newNum} onChange={handleNumChange} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

// Filter Component
const Filter = ({ handleFilterChange }) => {
	return (
		<div>
			filter shown with <input onChange={handleFilterChange} />
		</div>
	);
};

// Number Component
const Number = ({ names, filterName }) => {
	const filteredItem = names.filter((n) =>
		n.name.toLowerCase().includes(filterName.toLowerCase())
	);

	return (
		<>
			{(filteredItem.length > 0 ? filteredItem : names).map((item) => (
				<p key={item.name}>
					{item.name} {item.num}
				</p>
			))}
		</>
	);
};

const App = () => {
	const [persons, setPersons] = useState([
		{ name: "Arto Hellas", num: 123456 },
	]);
	const [newName, setNewName] = useState("");
	const [newNum, setNewNum] = useState("");
	const [newFilter, setNewFilter] = useState("");

	const addPhoneName = (event) => {
		event.preventDefault();
		const identicalName = persons.filter(
			(person) => person.name.toLowerCase() === newName.toLowerCase()
		);
		if (identicalName.length !== 0) {
			alert(`${newName} has already been added!`);
			return;
		}
		const phoneObj = {
			name: newName,
			num: newNum,
		};
		setPersons(persons.concat(phoneObj));
		setNewName("");
		setNewNum("");
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumChange = (event) => {
		setNewNum(event.target.value);
	};

	const handleFilterChange = (event) => {
		setNewFilter(event.target.value);
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Filter handleFilterChange={handleFilterChange} />

			<h3>Add new number</h3>
			<PhoneForm
				newName={newName}
				newNum={newNum}
				handleNameChange={handleNameChange}
				handleNumChange={handleNumChange}
				addPhoneName={addPhoneName}
			/>

			<h3>Numbers</h3>
			<Number names={persons} filterName={newFilter} />
		</div>
	);
};

export default App;
