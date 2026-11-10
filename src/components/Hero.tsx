import { Fragment } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { useCairoClock } from '../lib/useCairoClock'

type Word = {
  text: string
  italic?: boolean
  dot?: boolean
}

const lines: Word[][] = [
  [{ text: 'I' }, { text: 'build' }, { text: 'tools,' }],
  [{ text: 'and' }, { text: 'the' }, { text: 'systems', italic: true }],
  [{ text: 'they' }, { text: 'run' }, { text: 'on', dot: true }],
]

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
}

const rise: Variants = {
  hidden: { y: '140%' },
  visible: {
    y: '0%',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Hero() {
  const reduce = useReducedMotion()
  const clock = useCairoClock()

  return (
    <section aria-labelledby="hero-title" className="wrap hero">
      <div className="hero-eyebrow">
        <span className="eyebrow-live">
          <span className="live-dot" aria-hidden="true" />
          Proof of work, live.
        </span>
        <span className="eyebrow-clock">
          Cairo, EG <span aria-hidden="true">·</span> <time>{clock}</time>
        </span>
      </div>

      <div className="hero-center">
        <motion.h1
          id="hero-title"
          className="hero-title"
          aria-label="I build tools, and the systems they run on."
          variants={container}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? undefined : 'visible'}
        >
          {lines.map((line, lineIndex) => (
            <span className="hero-line" key={lineIndex} aria-hidden="true">
              {line.map((word, wordIndex) => (
                <Fragment key={word.text}>
                  <span className="hero-word">
                    <motion.span className="hero-word-inner" variants={reduce ? undefined : rise}>
                      {word.italic ? <em>{word.text}</em> : word.text}
                      {word.dot ? <span className="hero-dot">.</span> : null}
                    </motion.span>
                  </span>
                  {wordIndex < line.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.div
          className="hero-lower"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="hero-sub">
            Computer science student at BUE. I write TypeScript and Rust, self-host what I depend on, and spend the
            rest of the time measuring networks that lie.
          </p>

          <dl className="hero-meta">
            <div>
              <dt>Study</dt>
              <dd>ICS at BUE, year two</dd>
            </div>
            <div>
              <dt>Writes</dt>
              <dd>TypeScript, Rust, Go</dd>
            </div>
            <div>
              <dt>Runs</dt>
              <dd>Linux, self-hosted</dd>
            </div>
          </dl>
        </motion.div>
      </div>

    </section>
  )
}
