import { FormEvent } from 'react'
import type { DemoUser } from '../types'
import { demoUsers } from '../mockData'
import './Modal.css'

interface LoginModalProps {
  authError: string
  authFields: { email: string; password: string }
  loginReason: string
  onClose: () => void
  onFieldChange: (fields: { email: string; password: string }) => void
  onQuickAccess: (user: DemoUser) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function LoginModal({
  authError,
  authFields,
  loginReason,
  onClose,
  onFieldChange,
  onQuickAccess,
  onSubmit,
}: LoginModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className="modal-card"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-card__header">
          <span className="eyebrow">Autenticação</span>
          <h2>Acesse sua conta</h2>
          <p className="modal-reason">{loginReason}</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              autoComplete="email"
              placeholder="seu@email.com"
              type="email"
              value={authFields.email}
              onChange={(e) => onFieldChange({ ...authFields, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-pass">Senha</label>
            <input
              id="login-pass"
              autoComplete="current-password"
              placeholder="Sua senha"
              type="password"
              value={authFields.password}
              onChange={(e) => onFieldChange({ ...authFields, password: e.target.value })}
              required
            />
          </div>

          {authError && <p className="form-error">{authError}</p>}

          <button className="btn btn--primary btn--full" type="submit">
            Entrar
          </button>
        </form>

        <div className="quick-access">
          <span className="quick-access__title">Acesso rápido (Demo)</span>
          <div className="quick-access__grid">
            {demoUsers.map((user) => (
              <button
                className="quick-access__card"
                key={user.id}
                type="button"
                onClick={() => onQuickAccess(user)}
              >
                <strong>{user.name}</strong>
                <span>{user.role === 'manager' ? 'Gestor' : 'Cliente'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
