import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { projectApi, taskApi } from '../services/api'
import type { Project, Task } from '../types'

export default function DashboardPage() {
  const navigate = useNavigate()
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const [projects, setProjects] = useState<Project[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    Promise.all([
      projectApi.getAll(),
      ...[]
    ]).then(async ([projs]) => {
      setProjects(projs)
      const taskArrays = await Promise.all(projs.map(p => taskApi.getByProject(p.id)))
      setAllTasks(taskArrays.flat())
      setLoading(false)
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) return <p>Loading...</p>

  const todoCount = allTasks.filter(t => t.status === 'todo').length
  const inProgressCount = allTasks.filter(t => t.status === 'in-progress').length
  const doneCount = allTasks.filter(t => t.status === 'done').length

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <div>
          <span data-testid="user-name">{user?.name}</span>
          {' | '}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section aria-label="task stats" className="stats-row">
        <div data-testid="stat-todo" className="stat-card">
          <h3>Todo</h3>
          <p className="stat-number">{todoCount}</p>
        </div>
        <div data-testid="stat-in-progress" className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{inProgressCount}</p>
        </div>
        <div data-testid="stat-done" className="stat-card">
          <h3>Done</h3>
          <p className="stat-number">{doneCount}</p>
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2>Projects</h2>
          {user?.role === 'admin' && (
            <Link to="/projects/new">
              <button>+ New Project</button>
            </Link>
          )}
        </div>
        {projects.length === 0 && <p>No projects yet.</p>}
        <ul className="list-plain">
          {projects.map(p => (
            <li key={p.id} data-testid={`project-item-${p.id}`} className="list-item">
              <Link to={`/projects/${p.id}`}>{p.name}</Link>
              <p className="text-muted">{p.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
