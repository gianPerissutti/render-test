
import { useState, useEffect } from 'react'
import phonebookService from './services'

const Notification = ({ message, className}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`${className}`}>
      {message}
    </div>
  )
}

const Filter = ({ filter, setFilter }) => {
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};

const PersonForm = ({ persons, setPersons, setErrorMessage}) => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber };

    if (persons.find((person) => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find((person) => person.name === newName)
        const changedPerson = { name: newName, number: newNumber }
        phonebookService.update(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : changedPerson))
          })
          .catch(error => {
            setErrorMessage({ message: `Information of ${changedPerson.name} has already been removed from server`, className: 'error' })
            setTimeout(() => setErrorMessage(null), 3000);
            setPersons(persons.filter(person => person.id !== changedPerson.id))
          })
      }
    }

    else if (persons.find((person) => person.name === newName || person.number === newNumber)) {
      alert(`${newName} is already added to phonebook`);
    }

    else {
      phonebookService.create(newPerson)
        .then(response => {
          console.log("se agrego") 
          setPersons(persons.concat(newPerson)) 
          setErrorMessage({ message: `Added ${newPerson.name}`, className: 'successful' })
          setTimeout(() => setErrorMessage(null), 3000); 
        })
        .catch(error => { alert(error) })
    }



    setNewName('');
    setNewNumber('');
  };


  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleInputChange} />
      </div>
      <div>
        number:<input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, setPersons, filter }) => {

  useState(persons)

  const deletePerson = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      phonebookService.deletePerson(personToDelete.id)
        .then(response => {
          console.log(response)
          console.log(personToDelete.id)
          setPersons(persons.filter(person => person.id !== personToDelete.id))
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map((person) => (
          <div key={person.name}>
            <span>{person.name} {person.number} </span>
            <button onClick={() => deletePerson(person)}>delete</button>
          </div>
        ))}
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('');
  const [persons, setPersons] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    phonebookService.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage?.message} className={errorMessage?.className} />
      <div>
        <h2>Phonebook</h2>
        <Filter filter={filter} setFilter={setFilter} />
        <h3>add a new</h3>
        <PersonForm persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} />
        <h3>Numbers</h3>
        <Persons persons={persons} setPersons={setPersons} filter={filter} />
      </div>
    </div>
  );
};

export default App;