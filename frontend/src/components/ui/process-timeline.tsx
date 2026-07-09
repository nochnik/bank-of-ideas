"use client"

import * as React from "react"
import { HTMLMotionProps, MotionValue, motion, useScroll, useTransform } from "motion/react"
import { cn } from "@/lib/utils"

interface ProcessContainerContextValue {
  scrollYProgress: MotionValue<number>
}

const ProcessContainerContext = React.createContext<ProcessContainerContextValue | undefined>(undefined)

function useProcessContainerContext() {
  const context = React.useContext(ProcessContainerContext)
  if (!context) throw new Error("Must be inside ProcessContainer")
  return context
}

export function ProcessContainer({
  children,
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollRef })
  return (
    <ProcessContainerContext.Provider value={{ scrollYProgress }}>
      <div ref={scrollRef} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </ProcessContainerContext.Provider>
  )
}

export const ProcessSticky = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sticky left-0 top-0 w-full overflow-hidden", className)}
    {...props}
  />
))
ProcessSticky.displayName = "ProcessSticky"

export const ProcessCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
ProcessCardTitle.displayName = "ProcessCardTitle"

export const ProcessCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-8 p-6", className)} {...props} />
))
ProcessCardBody.displayName = "ProcessCardBody"

interface ProcessCardProps extends HTMLMotionProps<"div"> {
  itemsLength: number
  index: number
}

export const ProcessCard: React.FC<ProcessCardProps> = ({
  className,
  style,
  itemsLength,
  index,
  ...props
}) => {
  const { scrollYProgress } = useProcessContainerContext()
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const start = index / itemsLength
  const end = start + 1 / itemsLength

  const x = useTransform(
    scrollYProgress,
    [start, end],
    [typeof window !== "undefined" ? window.innerWidth : 1440, -(width * index) + 64 * index]
  )

  return (
    <motion.div
      ref={ref}
      style={{ x: index > 0 ? x : 0, ...style }}
      className={cn(
        "flex border min-w-[70%] max-w-[70%] border-hl bg-s1/80 backdrop-blur-sm text-ink",
        className
      )}
      {...props}
    />
  )
}
ProcessCard.displayName = "ProcessCard"
