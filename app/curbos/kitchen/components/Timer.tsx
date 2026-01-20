import { useEffect, useState } from 'react';

export function Timer({ timestamp }: { timestamp: number }) {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - timestamp) / 60000))
        }, 10000)

        setElapsed(Math.floor((Date.now() - timestamp) / 60000))
        return () => clearInterval(interval)
    }, [timestamp])

    return <span>{elapsed}M</span>
}
