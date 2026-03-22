import styles from './UI.module.css'

// ── Button ──────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', loading, fullWidth, onClick, type = 'button', disabled }) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[`btn_${variant}`],
        styles[`btn_${size}`],
        fullWidth ? styles.btn_full : '',
      ].join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  )
}

// ── Input ────────────────────────────────────────────────────────
export function Input({ label, id, error, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <input id={id} className={`${styles.input} ${error ? styles.input_error : ''}`} {...props} />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  )
}

// ── Select ───────────────────────────────────────────────────────
export function Select({ label, id, children, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <select id={id} className={styles.select} {...props}>
        {children}
      </select>
    </div>
  )
}

// ── Alert ────────────────────────────────────────────────────────
export function Alert({ type = 'error', children }) {
  if (!children) return null
  return <div className={`${styles.alert} ${styles[`alert_${type}`]}`}>{children}</div>
}

// ── Badge ────────────────────────────────────────────────────────
export function Badge({ children, color = 'orange' }) {
  return <span className={`${styles.badge} ${styles[`badge_${color}`]}`}>{children}</span>
}

// ── Card ─────────────────────────────────────────────────────────
export function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>
}

export function CardHeader({ children }) {
  return <div className={styles.cardHeader}>{children}</div>
}

export function CardBody({ children }) {
  return <div className={styles.cardBody}>{children}</div>
}

// ── Spinner ──────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className={styles.spinnerWrap}>
      <span className={styles.spinnerLg} />
    </div>
  )
}

// ── Section Eyebrow ──────────────────────────────────────────────
export function Eyebrow({ children }) {
  return <div className={styles.eyebrow}>{children}</div>
}
