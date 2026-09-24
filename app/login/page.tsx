'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { safeInternalPath } from '../../lib/redirect'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) {
        setError(response.status === 503 ? 'Sign-in is not configured yet. Contact the workspace administrator.' : 'The username or password was not recognized.')
        return
      }
      const next = new URLSearchParams(window.location.search).get('next')
      window.location.assign(safeInternalPath(next))
    } catch {
      setError('We could not complete sign-in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand"><span className="login-brand-mark">P</span><span>PAM<small>Mission Control</small></span></div>
        <h1 id="login-title">Welcome back.</h1>
        <p>Sign in to access the internal Revenue Manager workspace.</p>
        <form className="login-form" onSubmit={signIn}>
          <label htmlFor="username">Username</label>
          <input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        {error && <p className="login-error" role="alert">{error}</p>}
        <p className="login-footer">Protected internal workspace. Unauthorized access is prohibited.</p>
      </section>
    </main>
  )
}
