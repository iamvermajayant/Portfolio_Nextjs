import React from "react"

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
  reverse?: boolean
  duration?: number
  radius?: number
  path?: boolean
  iconSize?: number
  speed?: number
}

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  radius = 230,
  path = true,
  iconSize = 10,
  speed = 1,
  ...props
}: OrbitingCirclesProps) {
  const calculatedDuration = duration / speed
  const totalChildren = React.Children.count(children)
  if (totalChildren === 0) return null
  const stagger = calculatedDuration / totalChildren
  const angleOffset = 360 / totalChildren

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Optional orbit path circle */}
      {path && (
        <div
          className="pointer-events-none absolute rounded-full border border-gray-300/50 dark:border-gray-600/50"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
          }}
        />
      )}
      {/* Orbiting icons */}
      {React.Children.map(children, (child, index) => {
        const angle = angleOffset * index
        return (
          <div
            key={index}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* animate rotation on this wrapper only */}
            <div
              className={cn(
                reverse ? "animate-orbit-reverse" : "animate-orbit",
                "absolute inset-0 flex items-center justify-center"
              )}
              style={
                {
                  ["--duration" as any]: `${calculatedDuration}s`,
                  animationDelay: `-${stagger * index}s`,
                  transform: `rotate(${angle}deg)`,
                } as React.CSSProperties
              }
            >
              {/* icon positioning inside the orbit */}
              <div
                style={{
                  transform: `translateX(${radius}px) rotate(-${angle}deg)`,
                  width: iconSize,
                  height: iconSize,
                }}
                className={cn(
                  "flex items-center justify-center rounded-full",
                  className
                )}
                {...props}
              >
                <div
                  style={{
                    transform: reverse ? 'rotate(0deg)' : 'rotate(0deg)',
                  }}
                >
                  {child}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}