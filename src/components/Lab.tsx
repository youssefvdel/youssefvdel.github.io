import { useEffect, useState } from 'react'
import { formatAgo, formatCapacity, formatUptime } from '../lib/status'
import { useStatus } from '../lib/useStatus'
import { Reveal } from './Reveal'

export function Lab() {
  const status = useStatus()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const data = status.phase === 'live' ? status.data : null
  const up = data ? data.services.filter((service) => service.up).length : 0
  const total = data ? data.services.length : 0
  const summary =
    status.phase === 'live'
      ? `${up} of ${total} services answering`
      : status.phase === 'offline'
        ? 'Live status is unavailable from this origin.'
        : 'Contacting the machine.'

  return (
    <section id="lab" aria-labelledby="lab-title" className="wrap section">
      <Reveal>
        <div className="section-head">
          <div className="section-heading">
            <h2 id="lab-title" className="section-title">
              The <em>lab</em>
            </h2>
          </div>
          <p className="lab-intro">
            Six services behind one TOTP door, published through a tunnel with no open ports.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="lab-body">
          <div className="status-panel">
            <p className="sr-only" role="status">
              {summary}
            </p>

            {data ? (
              <>
                <p className="status-summary">
                  <span className="live-dot" aria-hidden="true" />
                  <span>
                    <strong>
                      {up}/{total}
                    </strong>{' '}
                    answering
                  </span>
                  <span className="status-sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="status-probed">probed {formatAgo(data.probedAt, now)}</span>
                </p>

                {data.services.length > 0 ? (
                  <ol className="services">
                    {data.services.map((service, index) => (
                      <li className="service" key={`${service.name}-${index}`}>
                        <span className={`lamp${service.up ? ' is-up' : ''}`} aria-hidden="true" />
                        <span className="service-name">
                          {service.name}
                          <span className="sr-only">{service.up ? ', up' : ', down'}</span>
                        </span>
                        <span className="service-ms">{service.up ? `${Math.round(service.ms)} ms` : '—'}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="status-empty">The box answered with no services.</p>
                )}
              </>
            ) : status.phase === 'offline' ? (
              <div className="status-offline">
                <div className="offline-top">
                  <span className="lamp" aria-hidden="true" />
                  <span className="label">Status · off-box</span>
                </div>
                <p className="offline-copy">
                  Live status is served from the box —{' '}
                  <a href="https://youssefvdel.dpdns.org" target="_blank" rel="noreferrer">
                    open the apex domain
                  </a>
                  .
                </p>
                <div className="offline-foot">
                  <span className="label">No sample data</span>
                  <span className="label">The board fills in on the apex</span>
                </div>
              </div>
            ) : (
              <div className="status-loading">
                <span className="live-dot" aria-hidden="true" />
                <span>Contacting the box…</span>
              </div>
            )}
          </div>

          <aside className="lab-spec" aria-label="The machine">
            <p className="label">The machine</p>

            {data ? (
              <dl className="spec">
                <div>
                  <dt>Uptime</dt>
                  <dd>{formatUptime(data.uptime)}</dd>
                </div>
                <div>
                  <dt>Load</dt>
                  <dd>{data.load1.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Memory</dt>
                  <dd>{formatCapacity(data.memUsed, data.memTotal)}</dd>
                </div>
                <div>
                  <dt>Disk</dt>
                  <dd>{formatCapacity(data.diskUsed, data.diskTotal)}</dd>
                </div>
              </dl>
            ) : (
              <dl className="spec">
                <div>
                  <dt>Host</dt>
                  <dd>HP Z440 · Cairo</dd>
                </div>
                <div>
                  <dt>Door</dt>
                  <dd>One TOTP gate</dd>
                </div>
                <div>
                  <dt>Edge</dt>
                  <dd>Cloudflare tunnel</dd>
                </div>
                <div>
                  <dt>Ports</dt>
                  <dd>None open</dd>
                </div>
              </dl>
            )}

            <p className="spec-note">{data ? 'Read from the host, no cache.' : 'Static facts. No sample data.'}</p>
          </aside>
        </div>
      </Reveal>
    </section>
  )
}
