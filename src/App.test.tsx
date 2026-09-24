import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Mission Control', () => {
  it('creates a task in the actively working lane', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /new task/i }))
    await user.type(screen.getByLabelText(/task name/i), 'Review launch brief')
    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(screen.getByRole('heading', { name: 'Review launch brief' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /actively working/i }).closest('.lane')).toHaveTextContent('Review launch brief')
  })

  it('adds an operator message to the revenue manager chat', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/message revenue manager/i), 'What needs a decision?')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText('What needs a decision?')).toBeInTheDocument()
  })

  it('closes the task dialog with Escape and restores focus to its trigger', async () => {
    const user = userEvent.setup()
    render(<App />)

    const trigger = screen.getByRole('button', { name: /new task/i })
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('restores focus to the board trigger when it opened the dialog', async () => {
    const user = userEvent.setup()
    render(<App />)

    const trigger = screen.getByRole('button', { name: /add task/i })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(trigger).toHaveFocus()
  })

  it('renders a labeled illustrated workflow office with an accessible static summary', () => {
    render(<App />)

    expect(screen.getByRole('img', { name: /illustrated workflow office/i })).toBeInTheDocument()
    expect(screen.getByText('Intelligence library')).toBeInTheDocument()
    expect(screen.getByText('Operations studio')).toBeInTheDocument()
    expect(screen.getByText('Decision suite')).toBeInTheDocument()
    expect(screen.getByText('Illustration only · not live activity data')).toBeInTheDocument()
  })
})
