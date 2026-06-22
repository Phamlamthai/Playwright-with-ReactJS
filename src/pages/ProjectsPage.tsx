import { useState, useEffect, type SubmitEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { projectApi, taskApi } from '../services/api'
import type { Project, Task } from '../types'

// ─── New Project Form (multi-step) ───────────────────────────────────────────
export function NewProjectPage() {
  const navigate = useNavigate()
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleStep1 = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) { setError('Project name is required'); return }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await projectApi.create({
        name,
        description,
        ownerId: user.id,
        createdAt: new Date().toISOString().split('T')[0],
      })
      navigate('/dashboard')
    } catch {
      setError('Failed to create project')
    }
  }

  return (
    <div className="form-card">
      <Link to="/dashboard">← Back</Link>
      <h2>New Project</h2>
      <p data-testid="step-indicator">Step {step} of 2</p>

      {step === 1 && (
        <form onSubmit={handleStep1}>
          <div className="form-group-sm">
            <label htmlFor="project-name">Project Name</label><br />
            <input
              id="project-name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-control"
            />
          </div>
          {error && <p role="alert" className="form-error">{error}</p>}
          <button type="submit">Next →</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div className="form-group-sm">
            <label htmlFor="project-description">Description</label><br />
            <textarea
              id="project-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="form-control"
            />
          </div>
          {error && <p role="alert" className="form-error">{error}</p>}
          <div className="btn-row">
            <button type="button" onClick={() => setStep(1)}>← Back</button>
            <button type="submit">Create Project</button>
          </div>
        </form>
      )}
    </div>
  )
}

// ─── Project Detail (tasks list) ─────────────────────────────────────────────
export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (!id) return
    Promise.all([
      projectApi.getById(Number(id)),
      taskApi.getByProject(Number(id)),
    ]).then(([proj, taskList]) => {
      setProject(proj)
      setEditName(proj.name)
      setEditDescription(proj.description)
      setTasks(taskList)
      setLoading(false)
    })
  }, [id])

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project?')) return
    await projectApi.delete(Number(id))
    navigate('/dashboard')
  }

  const handleSaveEdit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const updated = await projectApi.update(Number(id), { name: editName, description: editDescription })
    setProject(updated)
    setEditing(false)
  }

  const handleDeleteTask = async (taskId: number) => {
    await taskApi.delete(taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter ? t.status === statusFilter : true
    return matchSearch && matchStatus
  })

  if (loading) return <p>Loading...</p>
  if (!project) return <p>Project not found</p>

  return (
    <div className="page">
      <Link to="/dashboard">← Dashboard</Link>

      {!editing ? (
        <div className="project-header">
          <h1 data-testid="project-title">{project.name}</h1>
          <p data-testid="project-description">{project.description}</p>
          {user?.role === 'admin' && (
            <div className="admin-actions">
              <button onClick={() => setEditing(true)}>Edit Project</button>
              <button onClick={handleDeleteProject} className="btn-danger">Delete Project</button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSaveEdit} className="edit-form">
          <input
            aria-label="Edit project name"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="edit-control"
          />
          <textarea
            aria-label="Edit project description"
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            rows={3}
            className="edit-control"
          />
          <button type="submit">Save</button>{' '}
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}

      <div className="task-filter-row">
        <input
          aria-label="Search tasks"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="task-search"
        />
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="task-filter-select"
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="task-header">
        <h2>Tasks ({filtered.length})</h2>
        <Link to={`/projects/${id}/tasks/new`}>
          <button>+ New Task</button>
        </Link>
      </div>

      {filtered.length === 0 && <p data-testid="no-tasks">No tasks found.</p>}
      <ul className="list-plain">
        {filtered.map(task => (
          <li
            key={task.id}
            data-testid={`task-item-${task.id}`}
            className="list-item"
          >
            <div className="task-item-row">
              <div>
                <strong>{task.title}</strong>
                <span
                  data-testid={`task-status-${task.id}`}
                  className="badge badge-status"
                >
                  {task.status}
                </span>
                <span className="badge badge-priority">
                  {task.priority}
                </span>
                {task.attachment && (
                  <span data-testid={`task-attachment-${task.id}`} className="task-attachment">
                    📎 {task.attachment}
                  </span>
                )}
              </div>
              <button onClick={() => handleDeleteTask(task.id)} className="btn-danger-sm">Delete</button>
            </div>
            <p className="task-description">{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
