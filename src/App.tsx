import { useState, useEffect, useMemo, FormEvent } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'

// Types
import {
  type DemoUser,
  type Product,
  type Order,
  type CartItem,
  type CartEntry,
  type ProductDraft,
  type LoginIntent,
  type PaymentMethod,
  type Address,
  type ProductSalesEntry,
} from './types'

// Mock Data
import {
  initialProducts,
  initialOrders,
  demoUsers,
  demoPaymentMethods,
  demoAddresses,
} from './mockData'

// Utils
import { STORAGE_KEYS, readStorageValue } from './utils/storage'
import {
  normalizeProducts,
  normalizeOrders,
  normalizeCartStore,
} from './utils/normalizers'
import { buildSku } from './utils/formatters'

// Components
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LoginModal } from './components/LoginModal'
import { ProductEditorModal } from './components/ProductEditorModal'

// Pages
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { CartPage } from './pages/CartPage'
import { AccountPage } from './pages/AccountPage'
import { ManagerPanelPage } from './pages/ManagerPanelPage'

// Styles
import './styles/variables.css'
import './styles/base.css'
import './App.css'

function App() {
  const navigate = useNavigate()
  const location = useLocation()


  // --- State: Auth ---
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
    try {
      return readStorageValue<DemoUser | null>(STORAGE_KEYS.session, null)
    } catch (e) {
      console.error('App: failed to read session', e);
      return null;
    }
  })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginIntent, setLoginIntent] = useState<LoginIntent | null>(null)
  const [authError, setAuthError] = useState('')
  const [authFields, setAuthFields] = useState({ email: '', password: '' })

  // --- State: Catalog & Data ---
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = readStorageValue(STORAGE_KEYS.products, initialProducts)
      return normalizeProducts(stored)
    } catch (e) {
      console.error('App: failed to normalize products', e);
      return initialProducts;
    }
  })

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = readStorageValue(STORAGE_KEYS.orders, initialOrders)
      return normalizeOrders(stored)
    } catch (e) {
      console.error('App: failed to normalize orders', e);
      return initialOrders;
    }
  })

  const [cartStore, setCartStore] = useState<Record<string, CartItem[]>>(() => {
    try {
      const stored = readStorageValue(STORAGE_KEYS.carts, {})
      return normalizeCartStore(stored)
    } catch (e) {
      console.error('App: failed to normalize cart', e);
      return {};
    }
  })

  const [catalogSearch, setCatalogSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  // --- State: Management ---
  const [showEditorModal, setShowEditorModal] = useState(false)
  const [draftProduct, setDraftProduct] = useState<ProductDraft | null>(null)

  // --- Computed Values ---
  const isAuthenticated = !!currentUser
  const canManage = currentUser?.role === 'manager'
  
  const currentCart = useMemo(() => {
    if (!currentUser) return []
    return cartStore[currentUser.id] || []
  }, [cartStore, currentUser])

  const cartEntries = useMemo<CartEntry[]>(() => {
    return currentCart.reduce<CartEntry[]>((acc, item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        acc.push({
          product,
          quantity: item.quantity,
          total: product.price * item.quantity,
        })
      }
      return acc
    }, [])
  }, [currentCart, products])

  const cartSubtotal = cartEntries.reduce((sum, entry) => sum + entry.total, 0)
  const shippingCost = cartSubtotal >= 199 || cartSubtotal === 0 ? 0 : 25
  const cartTotal = cartSubtotal + shippingCost
  const cartItemCount = currentCart.length

  const categories = useMemo(() => {
    return ['Todos', ...new Set(products.map((p) => p.category))]
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(catalogSearch.toLowerCase())
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [products, catalogSearch, activeCategory])

  const salesStats = useMemo<ProductSalesEntry[]>(() => {
    return products.map((product) => {
      const productOrders = orders.filter((order) =>
        order.items.some((item) => item.productId === product.id)
      )
      const units = productOrders.reduce((sum, order) => {
        const item = order.items.find((i) => i.productId === product.id)
        return sum + (item?.quantity || 0)
      }, 0)
      return {
        productId: product.id,
        title: product.title,
        units,
        revenue: units * product.price,
      }
    })
  }, [products, orders])

  // --- Effects ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [location.pathname, filteredProducts, activeCategory])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // --- Handlers: Auth ---
  const handleLoginOpen = (reason: string, intent?: LoginIntent) => {
    setAuthError('')
    setAuthFields({ email: '', password: '' })
    setLoginIntent(intent || { action: 'account', reason })
    setShowLoginModal(true)
  }

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault()
    const user = demoUsers.find(
      (u) => u.email === authFields.email && u.password === authFields.password
    )
    if (user) {
      setCurrentUser(user)
      window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user))
      setShowLoginModal(false)
      if (loginIntent?.redirectTo) navigate(loginIntent.redirectTo)
    } else {
      setAuthError('Credenciais inválidas. Use o acesso rápido para testar.')
    }
  }

  const handleQuickAccess = (user: DemoUser) => {
    setCurrentUser(user)
    window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user))
    setShowLoginModal(false)
    if (loginIntent?.redirectTo) navigate(loginIntent.redirectTo)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    window.localStorage.removeItem(STORAGE_KEYS.session)
    navigate('/')
  }

  // --- Handlers: Cart ---
  const updateCart = (newCart: CartItem[]) => {
    if (!currentUser) return
    const newStore = { ...cartStore, [currentUser.id]: newCart }
    setCartStore(newStore)
    window.localStorage.setItem(STORAGE_KEYS.carts, JSON.stringify(newStore))
  }

  const handleAddToCart = (productId: string, action: 'add' | 'buy') => {
    if (!isAuthenticated) {
      handleLoginOpen('Entre para adicionar itens ao seu carrinho.', {
        action,
        productId,
        reason: 'Auth required for cart',
      })
      return
    }

    const existing = currentCart.find((item) => item.productId === productId)
    let nextCart: CartItem[]
    if (existing) {
      nextCart = currentCart.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      nextCart = [...currentCart, { productId, quantity: 1 }]
    }
    updateCart(nextCart)

    if (action === 'buy') navigate('/carrinho')
  }

  const handleCartQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveFromCart(productId)
      return
    }
    const nextCart = currentCart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    )
    updateCart(nextCart)
  }

  const handleRemoveFromCart = (productId: string) => {
    const nextCart = currentCart.filter((item) => item.productId !== productId)
    updateCart(nextCart)
  }

  const handleCheckout = () => {
    if (!currentUser) return

    const newOrder: Order = {
      id: `PED-${5201 + orders.length}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      createdAt: new Date().toISOString(),
      status: 'Pagamento aprovado',
      channel: 'Site',
      paymentLabel: 'Pagamento Digital',
      addressLabel: 'Endereço Principal',
      items: cartEntries.map((e) => ({
        productId: e.product.id,
        title: e.product.title,
        quantity: e.quantity,
        price: e.product.price,
      })),
      total: cartTotal,
      tracking: [
        { label: 'Pagamento aprovado', date: new Date().toISOString(), done: true },
        { label: 'Preparação do pedido', date: 'Em andamento', done: false },
        { label: 'Transporte', date: 'Aguardando', done: false },
      ],
    }

    const nextOrders = [newOrder, ...orders]
    setOrders(nextOrders)
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(nextOrders))
    updateCart([])
    navigate('/conta')
  }

  // --- Handlers: Management ---
  const handleToggleProductStatus = (productId: string) => {
    const nextProducts = products.map((p) =>
      p.id === productId
        ? { ...p, status: p.status === 'Disponivel' ? ('Pausado' as const) : ('Disponivel' as const) }
        : p
    )
    setProducts(nextProducts)
    window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(nextProducts))
  }

  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault()
    if (!draftProduct) return

    const price = parseFloat(draftProduct.price) || 0
    const originalPrice = parseFloat(draftProduct.originalPrice) || undefined

    const productData: Product = {
      id: draftProduct.id || `prod-${Date.now()}`,
      title: draftProduct.title,
      category: draftProduct.category,
      brand: draftProduct.brand,
      description: draftProduct.description,
      longDescription: draftProduct.longDescription,
      price,
      originalPrice,
      stock: parseInt(draftProduct.stock) || 0,
      badge: draftProduct.badge,
      accent: draftProduct.accent,
      featured: draftProduct.featured,
      status: draftProduct.status,
      sku: draftProduct.id ? products.find(p => p.id === draftProduct.id)?.sku || buildSku(draftProduct.title) : buildSku(draftProduct.title),
      sales: draftProduct.id ? products.find(p => p.id === draftProduct.id)?.sales || 0 : 0,
      rating: draftProduct.id ? products.find(p => p.id === draftProduct.id)?.rating || 4.8 : 4.8,
      reviewCount: draftProduct.id ? products.find(p => p.id === draftProduct.id)?.reviewCount || 12 : 12,
      shipping: draftProduct.shipping,
      installments: draftProduct.installments,
      features: draftProduct.id ? products.find(p => p.id === draftProduct.id)?.features || [] : [],
      specs: draftProduct.id ? products.find(p => p.id === draftProduct.id)?.specs || [] : [],
      imageUrl: draftProduct.id ? products.find(p => p.id === draftProduct.id)?.imageUrl || '' : '',
    }

    let nextProducts: Product[]
    if (draftProduct.id) {
      nextProducts = products.map((p) => (p.id === draftProduct.id ? productData : p))
    } else {
      nextProducts = [productData, ...products]
    }

    setProducts(nextProducts)
    window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(nextProducts))
    setShowEditorModal(false)
    setDraftProduct(null)
  }


  return (
    <div className="app-shell">
      <Header
        canManage={canManage}
        cartItemCount={cartItemCount}
        catalogSearch={catalogSearch}
        currentUser={currentUser}
        onLoginOpen={handleLoginOpen}
        onLogout={handleLogout}
        onSearchChange={setCatalogSearch}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                featuredProducts={products.filter((p) => p.featured)}
                onCategorySelect={(cat) => {
                  setActiveCategory(cat)
                  navigate('/catalogo')
                }}
              />
            }
          />
          <Route
            path="/catalogo"
            element={
              <CatalogPage
                activeCategory={activeCategory}
                categories={categories}
                products={filteredProducts}
                searchValue={catalogSearch}
                onAddToCart={handleAddToCart}
                onBuyNow={handleAddToCart}
                onCategoryChange={setActiveCategory}
                onSearchChange={setCatalogSearch}
              />
            }
          />
          <Route
            path="/produto/:productId"
            element={
              <ProductDetailsPage
                products={products}
                relatedProducts={products}
                onAddToCart={handleAddToCart}
                onBuyNow={handleAddToCart}
              />
            }
          />
          <Route
            path="/carrinho"
            element={
              <CartPage
                cartEntries={cartEntries}
                cartSubtotal={cartSubtotal}
                cartTotal={cartTotal}
                isAuthenticated={isAuthenticated}
                shippingCost={shippingCost}
                onCheckout={handleCheckout}
                onLoginRequest={() => handleLoginOpen('Acesse para finalizar sua compra.')}
                onQuantityChange={handleCartQuantityChange}
                onRemove={handleRemoveFromCart}
              />
            }
          />
          <Route
            path="/conta"
            element={
              <AccountPage
                addresses={demoAddresses}
                canManage={canManage}
                orders={orders.filter((o) => o.customerId === currentUser?.id)}
                paymentMethods={demoPaymentMethods}
                user={currentUser}
                onLoginRequest={() => handleLoginOpen('Entre para ver seu perfil.')}
              />
            }
          />
          <Route
            path="/painel"
            element={
              canManage ? (
                <ManagerPanelPage
                  orders={orders}
                  products={products}
                  salesStats={salesStats}
                  onEditProduct={(p) => {
                    setDraftProduct({
                      ...p,
                      price: p.price.toString(),
                      originalPrice: p.originalPrice?.toString() || '',
                      stock: p.stock.toString(),
                    })
                    setShowEditorModal(true)
                  }}
                  onNewProduct={() => {
                    setDraftProduct({
                      id: null,
                      title: '',
                      category: 'Casa & Decor',
                      brand: 'demo Loja Online',
                      description: '',
                      longDescription: '',
                      price: '',
                      originalPrice: '',
                      stock: '0',
                      badge: 'Novidade',
                      accent: 'peach',
                      featured: false,
                      status: 'Disponivel',
                      shipping: 'Envio nacional',
                      installments: 'Até 12x',
                    })
                    setShowEditorModal(true)
                  }}
                  onToggleStatus={handleToggleProductStatus}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </main>

      <Footer />

      {showLoginModal && (
        <LoginModal
          authError={authError}
          authFields={authFields}
          loginReason={loginIntent?.reason || ''}
          onClose={() => setShowLoginModal(false)}
          onFieldChange={setAuthFields}
          onQuickAccess={handleQuickAccess}
          onSubmit={handleLoginSubmit}
        />
      )}

      {showEditorModal && draftProduct && (
        <ProductEditorModal
          draft={draftProduct}
          onClose={() => setShowEditorModal(false)}
          onDraftChange={setDraftProduct}
          onSubmit={handleSaveProduct}
        />
      )}
    </div>
  )
}

export default App
