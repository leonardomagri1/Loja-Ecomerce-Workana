import { FormEvent } from 'react'
import { type ProductDraft } from '../types'
import { type AccentTone, type ProductStatus } from '../constants'


import './Modal.css'

interface ProductEditorModalProps {
  draft: ProductDraft
  onClose: () => void
  onDraftChange: (draft: ProductDraft | null) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ProductEditorModal({
  draft,
  onClose,
  onDraftChange,
  onSubmit,
}: ProductEditorModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className="modal-card modal-card--editor"
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
          <span className="eyebrow">Gestão de Inventário</span>
          <h2>{draft.id ? 'Editar Produto' : 'Novo Produto'}</h2>
          <p className="modal-reason">Atualize as informações do item no catálogo.</p>
        </div>

        <form className="editor-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Título do Produto</label>
            <input
              value={draft.title}
              onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Marca</label>
            <input
              value={draft.brand}
              onChange={(e) => onDraftChange({ ...draft, brand: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>
            <input
              value={draft.category}
              onChange={(e) => onDraftChange({ ...draft, category: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Selo / Badge</label>
            <input
              value={draft.badge}
              onChange={(e) => onDraftChange({ ...draft, badge: e.target.value })}
            />
          </div>

          <div className="form-group-full form-group">
            <label>Descrição Curta</label>
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) => onDraftChange({ ...draft, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group-full form-group">
            <label>Descrição Detalhada</label>
            <textarea
              rows={4}
              value={draft.longDescription}
              onChange={(e) => onDraftChange({ ...draft, longDescription: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Preço Atual (R$)</label>
            <input
              type="number"
              step="0.01"
              value={draft.price}
              onChange={(e) => onDraftChange({ ...draft, price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Preço Original (R$ - opcional)</label>
            <input
              type="number"
              step="0.01"
              value={draft.originalPrice}
              onChange={(e) => onDraftChange({ ...draft, originalPrice: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Estoque</label>
            <input
              type="number"
              value={draft.stock}
              onChange={(e) => onDraftChange({ ...draft, stock: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Cor de Destaque</label>
            <select
              value={draft.accent}
              onChange={(e) => onDraftChange({ ...draft, accent: e.target.value as AccentTone })}
            >
              <option value="peach">Pêssego</option>
              <option value="cyan">Ciano</option>
              <option value="gold">Dourado</option>
              <option value="berry">Amora</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={draft.status}
              onChange={(e) => onDraftChange({ ...draft, status: e.target.value as ProductStatus })}
            >
              <option value="Disponivel">Disponível</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>

          <label className="editor-form__checkbox">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => onDraftChange({ ...draft, featured: e.target.checked })}
            />
            Destacar este produto na página inicial
          </label>

          <div className="editor-form__actions">
            <button className="btn btn--primary" type="submit">
              {draft.id ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
            <button className="btn btn--secondary" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
