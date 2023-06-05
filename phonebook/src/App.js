import { useState, useEffect } from 'react'
import axios from 'axios'
import numberService from './components/numberService'

const Numbers = ({person, onClick}) => {
  return(
    <p key={person.id}>{person.name} {person.number} <button onClick={onClick}>Delete</button></p>
  )
}

const ErrorMessage = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  if(message === null){
    return null
  }
  return(
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  if(message === null){
    return null
  }
  return(
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const Filter = ({value, onChange}) => {
  return(
    <div>filter shown with <input value={value} onChange={onChange}/></div>
  )
}

const PersonForm = ({onSubmit, name, nameChange, number, numberChange}) => {
  return(
    <div>
      <form onSubmit={onSubmit}>
        <div>name: <input value={name} onChange={nameChange}/></div>
        <div>number: <input value={number} onChange={numberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [allPersons, setAllPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    const filtered = () => allPersons.filter(person => person.name.indexOf(event.target.value) != -1)
    setPersons(filtered)
  }

  const deletePerson = (id, name) => {
    if(window.confirm('Delete ' + name + '?')){
      numberService.deleteNumber(id).then(n => {
        numberService
          .getAll()
          .then(response => {
            setAllPersons(response)
            setPersons(response)
          })
      })
      .catch(error => {
        setErrorMessage('Information of ' + name + ' has already been removed from server')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }

    
  }

  useEffect(() => {
    numberService
      .getAll()
      .then(response => {
        setAllPersons(response)
        setPersons(response)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    
    const personObject = {
      name: newName,
      number: newNumber
    }
    if(allPersons.filter((person) => person.name === newName).length > 0){
      const currPerson = allPersons.filter((person) => person.name === newName)[0]
      if(window.confirm(newName + ' is already added to phonebook, replace the old number with a new one?')){
        numberService
          .changeNumber(currPerson.id, personObject)
          .then(returned => {
            setAllPersons(allPersons.map(n => n.id !== currPerson.id ? n : returned))
            setPersons(persons.map(n => n.id !== currPerson.id ? n : returned))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage('Information of ' + newName + ' has already been removed from server')
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }else{
      numberService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setAllPersons(allPersons.concat(response))
          setNewName('')
          setNewNumber('')
          setNotifMessage('Added ' + newName)
          setTimeout(() => {
            setNotifMessage(null)
          }, 5000)
        })
      
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} />
      <ErrorMessage message={errorMessage} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>Add a new person</h2>
      <PersonForm onSubmit={addPerson} name={newName} nameChange={handleNameChange} number={newNumber} numberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {persons.map(person =>
        <Numbers person={person} onClick={() => deletePerson(person.id, person.name)}/>
      )}
      
    </div>
  )
}

export default App
