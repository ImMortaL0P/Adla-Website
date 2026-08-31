import { Fragment } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { cn } from '@/lib/utils'

interface AnimatedTitleProps {
  text: string
  as?: 'span' | 'div'
  className?: string
  wordClassName?: string
  stagger?: number
  startDelay?: number
}

/** Splits text into words and reveals them one by one (fade + rise), capped stagger, reduced-motion safe. */
export function AnimatedTitle({ text, as: Component = 'span', className, wordClassName, stagger = 70, startDelay = 0 }: AnimatedTitleProps) {
  const words = text.split(' ')

  return (
    <Component className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <Reveal as="span" delay={startDelay + Math.min(i * stagger, 600)} className={cn('inline-block', wordClassName)}>
            {word}
          </Reveal>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Component>
  )
}
