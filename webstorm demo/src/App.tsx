import { useState } from 'react'
import './App.css'


function App() {
  const [idInput, setIdInput] = useState('')
  const [searchType, setSearchType] = useState('user')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fetchData = async () => {
    if (!idInput) {
      setErrorMessage('Please enter an ID')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setResults([])

    try {
      const response = await fetch(`/api/search?type=${searchType}&id=${idInput}`)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderTable = () => {
    if (results.length === 0) return <p>No results</p>

    if (searchType === 'subject') {
      return (
          <table>
            <thead>
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Age</th>
            </tr>
            </thead>
            <tbody>
            {results.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                </tr>
            ))}
            </tbody>
          </table>
      )
    }

    if (searchType === 'user') {
      return (
          <table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Credits</th>
            </tr>
            </thead>
            <tbody>
            {results.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.name}</td>
                  <td>{subject.code}</td>
                  <td>{subject.description}</td>
                  <td>{subject.credits}</td>
                </tr>
            ))}
            </tbody>
          </table>
      )
    }
  }

  return (
      <div className="page">
        <header className="page-header">
          <h1>Search API</h1>
        </header>

        <div className="controls">
          <label>
            ID:
            <input
                type="text"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                placeholder="Enter user_id or subject_id"
            />
          </label>

          <label>
            Type:
            <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="user">User → Subjects</option>
              <option value="subject">Subject → Users</option>
            </select>
          </label>

          <button type="button" onClick={fetchData} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Search'}
          </button>

          {errorMessage && <span className="error">{errorMessage}</span>}
        </div>

        <div className="results">
          <h2>Results:</h2>
          {renderTable()}
        </div>
      </div>
  )
}

export default App