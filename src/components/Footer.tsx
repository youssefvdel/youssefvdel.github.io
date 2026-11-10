import { ArrowUp, ArrowUpRight } from './icons'
import { Reveal } from './Reveal'

export function Footer() {
  return (
    <footer id="contact" aria-labelledby="contact-title" className="wrap footer">
      <Reveal>
        <div className="footer-main">
          <div className="footer-lead">
            <h2 id="contact-title" className="footer-title">
              Say hi<span className="hero-dot">.</span>
            </h2>
          </div>

          <div className="contact-list">
            <a className="contact-link" href="mailto:youssefvdel@gmail.com">
              <span className="label">Email</span>
              <span className="contact-value">youssefvdel@gmail.com</span>
              <ArrowUpRight />
            </a>

            <a
              className="contact-link"
              href="https://github.com/youssefvdel"
              target="_blank"
              rel="noreferrer"
            >
              <span className="label">GitHub</span>
              <span className="contact-value">github.com/youssefvdel</span>
              <ArrowUpRight />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Reveal>

      <div className="footer-base">
        <span>Built on an HP Z440 in Cairo.</span>
        <span>© 2026 Youssef</span>
        <a href="#top">
          Back to top <ArrowUp />
        </a>
      </div>
    </footer>
  )
}
