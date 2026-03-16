import { useEffect, useState } from 'react'
import './App.css'

interface UserData {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  age: number
  password?: string
}

function User() {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      setErrorMessage('')
      const url = '/api/users'
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Chyba při načítání z ${url}: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        // Očekáváme pole uživatelů. Pokud přijde jeden objekt, zabalíme ho do pole.
        const usersData = Array.isArray(data) ? data : [data]
        setUsers(usersData)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Neznámá chyba'
        setErrorMessage(message)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUsers()
  }, [])

  return (
      <div className="page">
        <header className="page-header">
          <h1>Seznam uživatelů</h1>
          <a href="/">Zpět na API Test</a>
        </header>

        <div className="user-info" style={{ marginTop: '2rem' }}>
          {isLoading && <p>Načítám data z databáze...</p>}

          {errorMessage && (
              <div className="error" style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
                {errorMessage}
                <br />
                <small>Zkontrolujte, zda váš backend běží na portu 8080 a má endpoint /api/users</small>
              </div>
          )}

          {!isLoading && !errorMessage && users.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table className="user-table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Jméno</th>
                    <th>Příjmení</th>
                    <th>Uživatelské jméno</th>
                    <th>Věk</th>
                    <th>Email</th>
                    <th>Heslo</th>
                  </tr>
                  </thead>
                  <tbody>
                  {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName || '-'}</td>
                        <td>{user.lastName || '-'}</td>
                        <td>{user.username}</td>
                        <td>{user.age}</td>
                        <td>{user.email}</td>
                        <td>{user.password || '-'}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {!isLoading && !errorMessage && users.length === 0 && (
              <p>Žádná data nebyla nalezena.</p>
          )}
        </div>
      </div>
  );
}

export default User;