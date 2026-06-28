import { useState, useEffect, type SubmitEvent } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { taskApi, projectApi } from '../services/api'
import type { TaskStatus, TaskPriority, Project } from '../types'

export default function NewTaskPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  const [project, setProject] = useState<Project | null>(null)
  const [step, setStep] = useState(1)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    projectApi.getById(id).then(setProject)
  }, [id])

  const handleStep1 = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required'); return }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await taskApi.create({
        title,
        description,
        status,
        priority,
        projectId: Number(id),
        assigneeId: user.id,
        dueDate,
        attachment: file ? file.name : null,
      })
      navigate(`/projects/${id}`)
    } catch {
      setError('Failed to create task')
    }
  }

  return (
    <div className="form-card">
      <Link to={`/projects/${id}`}>← Back to {project?.name}</Link>
      <h2>New Task</h2>
      <p data-testid="step-indicator">Step {step} of 2</p>

      {step === 1 && (
        <form onSubmit={handleStep1}>
          <div className="form-group-sm">
            <label htmlFor="task-title">Task Title</label><br />
            <input
              id="task-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group-sm">
            <label htmlFor="task-description">Description</label><br />
            <textarea
              id="task-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
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
            <label htmlFor="task-status">Status</label><br />
            <select
              id="task-status"
              value={status}
              onChange={e => setStatus(e.target.value as TaskStatus)}
              className="form-control"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="form-group-sm">
            <label htmlFor="task-priority">Priority</label><br />
            <select
              id="task-priority"
              value={priority}
              onChange={e => setPriority(e.target.value as TaskPriority)}
              className="form-control"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group-sm">
            <label htmlFor="task-due-date">Due Date</label><br />
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group-sm">
            <label htmlFor="task-attachment">Attachment (optional)</label><br />
            <input
              id="task-attachment"
              type="file"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          {error && <p role="alert" className="form-error">{error}</p>}
          <div className="btn-row">
            <button type="button" onClick={() => setStep(1)}>← Back</button>
            <button type="submit">Create Task</button>
          </div>
        </form>
      )}
    </div>
  )
}
