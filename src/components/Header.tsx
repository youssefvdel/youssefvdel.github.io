const links = [
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Say hi' },
]

export function Header() {
  return (
    <header className="wrap">
      <div className="flex items-center justify-between gap-6 py-5 md:py-6">
        <a className="brand" href="#top" aria-label="Youssef — back to top">
          <span className="brand-mark" aria-hidden="true">
            Y<span className="brand-dot">.</span>
          </span>
          <span className="brand-name">Youssef</span>
        </a>

        <nav aria-label="Sections">
          <ul className="flex items-center gap-5 md:gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a className="nav-link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
