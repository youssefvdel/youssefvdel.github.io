import { ArrowUpRight, Lock } from './icons'
import { Magnetic } from './Magnetic'
import { Reveal } from './Reveal'

type Project = {
  number: string
  name: string
  blurb: string
  year: string
  stack: string
  href?: string
}

const projects: Project[] = [
  {
    number: '01',
    name: 'Recon',
    blurb: 'Live lobby scouting and in-game HUD widgets for VALORANT.',
    year: '2025–26',
    stack: 'TypeScript · Rust · Tauri',
    href: 'https://github.com/youssefvdel/Recon',
  },
  {
    number: '02',
    name: 'cantwise',
    blurb: 'An aim trainer that measures your hand instead of your score.',
    year: '2026',
    stack: 'Rust',
  },
  {
    number: '03',
    name: 'netwatch',
    blurb: 'Per-second latency, loss and the ISP data meter, kept as proof.',
    year: '2026',
    stack: 'Bun · TypeScript',
  },
  {
    number: '04',
    name: 'EveryGate',
    blurb: 'Every provider, one gate: an OpenAI-compatible API in front of accounts you own.',
    year: '2026',
    stack: 'TypeScript',
  },
  {
    number: '05',
    name: 'Arkrete',
    blurb: 'The website and mail stack for a family business.',
    year: '2025–26',
    stack: 'TypeScript · Go',
  },
]

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="wrap section">
      <Reveal>
        <div className="section-head">
          <div className="section-heading">
            <h2 id="work-title" className="section-title">
              Selected <em>work</em>
            </h2>
          </div>
          <p className="section-note">
            <span>Five projects</span>
            <span>2025–26</span>
          </p>
        </div>
      </Reveal>

      <ol className="work-list">
        {projects.map((project) => {
          const linked = Boolean(project.href)

          return (
            <li key={project.name}>
              <Reveal className={`work-row${linked ? ' is-linked' : ''}`}>
                <span className="work-num" aria-hidden="true">
                  {project.number}
                </span>

                <div className="work-main">
                  <h3 className="work-heading">
                    {project.href ? (
                      <Magnetic href={project.href} className="work-title work-title--link">
                        <span className="work-title-text">{project.name}</span>
                        <ArrowUpRight className="work-arrow" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </Magnetic>
                    ) : (
                      <span className="work-title">{project.name}</span>
                    )}
                  </h3>
                  <p className="work-blurb">{project.blurb}</p>
                </div>

                <div className="work-meta">
                  <span className="work-year">{project.year}</span>
                  <span>{project.stack}</span>
                  {!linked ? (
                    <span className="work-private">
                      <Lock />
                      Private
                    </span>
                  ) : null}
                </div>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
