import './CategoryNav.css'

interface CategoryNavProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) {
  return (
    <nav className="category-nav container" aria-label="Navegação por categorias">
      <div className="category-nav__list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-nav__item ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  )
}
