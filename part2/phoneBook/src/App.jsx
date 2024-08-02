import { useState, useEffect } from "react";
import axios from "axios";
import phonebookService from "./services/phonebook";

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
const Number = ({ names, filterName, handleDeleteNum }) => {
	if (names) {
		const filteredItem = names.filter((n) =>
			n.name.toLowerCase().includes(filterName.toLowerCase())
		);

		return (
			<>
				{(filteredItem.length > 0 ? filteredItem : names).map((item) => (
					<div key={item.name}>
						{item.name} {item.number}{" "}
						<button onClick={() => handleDeleteNum(item.id)}>Delete</button>
					</div>
				))}
			</>
		);
	}
};

const Notification = ({ message }) => {
	const notificationStyle = {
		backgroundColor: 'grey',
		fontSize: '1.2rem',
		color: 'green',
		border: '2px solid green',
		height: '1.5rem'
	}
	return (
		<>
			<div style={notificationStyle}>
				{message}
			</div>
		</>
	)
};

const App = () => {
	const [persons, setPersons] = useState("");
	const [newName, setNewName] = useState("");
	const [newNum, setNewNum] = useState("");
	const [newFilter, setNewFilter] = useState("");
	const [notificationMessage, setNewNotification] = useState("");

	const addPhoneName = (event) => {
		event.preventDefault();
		// find if person being added is already in the book
		const existingPerson = persons.find(
			(person) => person.name.toLowerCase() === newName.toLowerCase()
		);

		const phoneObj = {
			name: newName,
			number: newNum,
		};

		if (existingPerson) {
			// If the person exists, prompt for confirmation to update the number
			if (
				window.confirm(
					`${newName} already exists. Replace the old number with a new one?`
				)
			) {
				phonebookService
					.update(existingPerson.id, phoneObj)
					.then((updatedPerson) => {
						// Update the state with the modified person
						setPersons(
							persons.map((person) =>
								person.id === existingPerson.id ? updatedPerson : person
							)
						);
						setNewNotification(`${phoneObj.name}'s number updated`);
						setTimeout(() => {
							setNewNotification(null);
						},5000);
						setNewName("");
						setNewNum("");
					});
			}
		} else {
			// If the person doesn't exist, create a new entry
			phonebookService.create(phoneObj).then((newPerson) => {
				setPersons(persons.concat(newPerson));
				setNewNotification(`${phoneObj.name}'s number added`);
				setTimeout(() => {
					setNewNotification(null);
				}, 5000);
				setNewName("");
				setNewNum("");
			});
		}
	};

	// this line is to connect and sync w external db
	useEffect(() => {
		// 2nd then is used to handle extracted data from getAll taken from DB
		phonebookService.getAll().then((eachNum) => {
			setPersons(eachNum);
		});
	}, []);

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumChange = (event) => {
		setNewNum(event.target.value);
	};

	const handleFilterChange = (event) => {
		setNewFilter(event.target.value);
	};

	const handleDeleteNum = (id) => {
		// use the id to find the item and remove it
		const person = persons.find((person) => person.id === id);
		if (window.confirm(`Delete ${person.name}?`)) {
			phonebookService
				.remove(person.id)
				.then(() => setPersons(persons.filter((p) => p.id !== id)));
		}
	};

	return (
		<div>
			<Notification message={notificationMessage} />
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
			<Number
				names={persons}
				filterName={newFilter}
				handleDeleteNum={handleDeleteNum}
			/>
		</div>
	);
};

export default App;
