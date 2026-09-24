import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, MouseEvent as ReactMouseEvent } from 'react'
import {
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import './App.css'

type Stage = 'actively-working' | 'michael' | 'chris' | 'completed'

type Task = {
  id: number
  title: string
  owner: string
  stage: Stage
  priority: 'P1' | 'P2' | 'P3'
  note: string
  initials: string
}

const lanes: { id: Stage; label: string; accent: string; description: string }[] = [
  { id: 'actively-working', label: 'Actively working', accent: 'mint', description: 'Agents are moving this forward.' },
  { id: 'michael', label: 'Waiting for Michael', accent: 'amber', description: 'A business decision is needed.' },
  { id: 'chris', label: 'Waiting for Chris', accent: 'violet', description: 'A systems decision is needed.' },
  { id: 'completed', label: 'Completed', accent: 'blue', description: 'Accepted internal work.' },
]

const seedTasks: Task[] = [
  { id: 1, title: 'Build the revenue baseline import brief', owner: 'PAM Intelligence', stage: 'actively-working', priority: 'P1', note: 'Evidence map in progress', initials: 'PI' },
  { id: 2, title: 'Shape the controlled demo-led conversion test', owner: 'PAM Growth', stage: 'actively-working', priority: 'P1', note: 'Drafting the experiment brief', initials: 'PG' },
  { id: 3, title: 'Confirm the 90-day ICP focus', owner: 'Revenue Manager', stage: 'michael', priority: 'P1', note: 'Decision brief is ready', initials: 'RM' },
  { id: 4, title: 'Verify form handoff and source-of-truth scope', owner: 'PAM Web Experience', stage: 'chris', priority: 'P1', note: 'Technical review requested', initials: 'PW' },
  { id: 5, title: 'Core narrative handoff', owner: 'PAM Content', stage: 'completed', priority: 'P2', note: 'Accepted Sep 23', initials: 'PC' },
]

function PixelOffice() {
  return (
    <section className="office-panel" id="office" aria-labelledby="office-title">
      <div className="panel-heading">
        <div>
          <p className="section-label"><Sparkles size={13} /> Live agent floor</p>
          <h2 id="office-title">The office is in motion</h2>
        </div>
        <span className="live-badge"><i /> 5 agents online</span>
      </div>
      <div className="pixel-office" role="img" aria-label="Animated pixel art office showing five PAM agents working at desks">
        <div className="office-window"><span /><span /><span /></div>
        <div className="office-clock">09:41</div>
        <div className="plant"><i /><b /><em /></div>
        <div className="desk desk-one"><div className="screen">▣</div><div className="agent agent-mint"><b /></div><span className="lamp" /></div>
        <div className="desk desk-two"><div className="screen">···</div><div className="agent agent-violet"><b /></div><span className="paper" /></div>
        <div className="desk desk-three"><div className="screen">↗</div><div className="agent agent-amber"><b /></div><span className="coffee" /></div>
        <div className="office-cat">✦</div>
        <div className="floor-line" />
      </div>
      <div className="office-footer"><span><i className="presence mint" />PAM Intelligence researching</span><span><i className="presence violet" />Web Experience building</span></div>
    </section>
  )
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks)
  const [isTaskOpen, setTaskOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskOwner, setTaskOwner] = useState('Revenue Manager')
  const [message, setMessage] = useState('')
  const taskTriggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const [messages, setMessages] = useState([
    { sender: 'Revenue Manager', time: '09:38', text: 'I’ve triaged the morning queue. Two P1 items need a human decision before the agents can move.' },
    { sender: 'You', time: '09:40', text: 'What is the smallest decision that unblocks both?' },
  ])

  const totalWorking = useMemo(() => tasks.filter((task) => task.stage === 'actively-working').length, [tasks])

  const openTaskModal = (event: ReactMouseEvent<HTMLButtonElement>) => {
    taskTriggerRef.current = event.currentTarget
    setTaskOpen(true)
  }
  const closeTaskModal = () => {
    taskTriggerRef.current?.focus()
    setTaskOpen(false)
  }

  useEffect(() => {
    if (!isTaskOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeTaskModal()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled])'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isTaskOpen])

  const createTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = taskTitle.trim()
    if (!title) return
    setTasks((current) => [{ id: Date.now(), title, owner: taskOwner, stage: 'actively-working', priority: 'P2', note: 'New task · ready to assign', initials: taskOwner.split(' ').map((word) => word[0]).join('').slice(0, 2) }, ...current])
    setTaskTitle('')
    closeTaskModal()
  }

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    setMessages((current) => [...current, { sender: 'You', time: 'Now', text }])
    setMessage('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Mission Control navigation">
        <a className="brand" href="#top" aria-label="PAM Mission Control home"><span className="brand-mark">P</span><span>PAM<small>Mission Control</small></span></a>
        <nav>
          <a className="nav-item active" href="#command"><LayoutDashboard size={18} /> Command center</a>
          <a className="nav-item" href="#board"><Command size={18} /> Work board <span className="nav-count">{totalWorking}</span></a>
          <a className="nav-item" href="#office"><Users size={18} /> Agent office</a>
        </nav>
        <div className="sidebar-bottom"><div className="approval-note"><CircleHelp size={17} /><span>Human approvals are always explicit.</span></div><button className="profile" type="button"><span className="avatar operator">MN</span><span>Michael Neef<small>Operator</small></span><ChevronDown size={16} /></button></div>
      </aside>

      <main id="top">
        <header className="topbar">
          <div><p className="breadcrumb">Revenue organization <span>/</span> mission control</p><h1>Good morning, Michael.</h1></div>
          <div className="top-actions"><span className="date-stamp"><Clock3 size={16} /> Prototype view</span><button className="primary-button" type="button" onClick={openTaskModal}><Plus size={18} /> New task</button></div>
        </header>

        <section className="command-grid" id="command" aria-label="Command center">
          <section className="brief-card">
            <div className="panel-heading"><div><p className="section-label">Today’s signal</p><h2>Move the work that matters.</h2></div><span className="pulse-dot" aria-label="Live" /></div>
            <p className="brief-copy">The team has <strong>{totalWorking} active workstreams</strong>. Two decisions are waiting for an owner; clearing either one releases the next agent handoff.</p>
            <div className="decision-strip"><div className="decision-icon"><Bot size={19} /></div><div><strong>Next recommended decision</strong><span>Confirm the 90-day ICP focus</span></div><button type="button" aria-label="Open next decision"><ArrowUpRight size={18} /></button></div>
          </section>
          <PixelOffice />
        </section>

        <section className="chat-section" aria-labelledby="chat-title">
          <div className="chat-header"><div><p className="section-label"><MessageCircle size={13} /> Direct line</p><h2 id="chat-title">Revenue Manager chat</h2></div><span className="agent-status"><i /> Available now</span></div>
          <div className="chat-body">{messages.map((item, index) => <article className={`message ${item.sender === 'You' ? 'from-you' : ''}`} key={`${item.time}-${index}`}><span className="avatar manager">{item.sender === 'You' ? 'MN' : 'RM'}</span><div><div className="message-meta"><strong>{item.sender}</strong><time>{item.time}</time></div><p>{item.text}</p></div></article>)}</div>
          <form className="chat-compose" onSubmit={sendMessage}><label className="sr-only" htmlFor="manager-message">Message Revenue Manager</label><input id="manager-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask the Revenue Manager anything…" /><button type="submit" aria-label="Send message"><Send size={17} /><span>Send message</span></button></form>
        </section>

        <section className="board-section" id="board" aria-labelledby="board-title">
          <div className="board-heading"><div><p className="section-label">Task flow</p><h2 id="board-title">Work board</h2><p>Track active decisions and agent handoffs without losing the reason behind the work.</p></div><button className="quiet-button" type="button" onClick={openTaskModal}><Plus size={17} /> Add task</button></div>
          <div className="kanban" aria-label="Task kanban board">{lanes.map((lane) => <section className="lane" key={lane.id} aria-labelledby={`${lane.id}-title`}><div className="lane-header"><div><span className={`lane-dot ${lane.accent}`} /><h3 id={`${lane.id}-title`}>{lane.label}</h3></div><span>{tasks.filter((task) => task.stage === lane.id).length}</span></div><p className="lane-description">{lane.description}</p><div className="task-list">{tasks.filter((task) => task.stage === lane.id).map((task) => <article className="task-card" key={task.id}><div className="task-top"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><button type="button" aria-label={`More options for ${task.title}`}>•••</button></div><h4>{task.title}</h4><p>{task.note}</p><footer><span className="task-owner"><span className="avatar mini">{task.initials}</span>{task.owner}</span>{lane.id === 'completed' && <Check size={16} aria-label="Completed" />}</footer></article>)}</div></section>)}</div>
        </section>
      </main>

      {isTaskOpen && <div className="modal-backdrop" role="presentation" onMouseDown={closeTaskModal}><section className="task-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="task-dialog-title" onMouseDown={(event) => event.stopPropagation()}><div className="dialog-heading"><div><p className="section-label">New work item</p><h2 id="task-dialog-title">Start a task with intent.</h2></div><button className="icon-button" type="button" onClick={closeTaskModal} aria-label="Close task form"><X size={19} /></button></div><form onSubmit={createTask}><label htmlFor="task-name">Task name</label><input id="task-name" value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Describe the outcome, not the activity" autoFocus /><label htmlFor="task-owner">Initial owner</label><select id="task-owner" value={taskOwner} onChange={(event) => setTaskOwner(event.target.value)}><option>Revenue Manager</option><option>PAM Intelligence</option><option>PAM Growth</option><option>PAM Content</option><option>PAM Web Experience</option></select><div className="dialog-actions"><button type="button" className="quiet-button" onClick={closeTaskModal}>Cancel</button><button type="submit" className="primary-button">Create task</button></div></form></section></div>}
    </div>
  )
}

export default App