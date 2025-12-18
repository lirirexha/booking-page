'use client'
import styles from './page.module.css'

import { gql, useQuery } from '@apollo/client'
import { useMemo, useState, use } from 'react'
import { useRouter } from 'next/navigation'

const AVAILABLE_SLOTS = gql`
  query AvailableSlots($serviceId: ID!, $date: String!) {
    availableSlots(serviceId: $serviceId, date: $date)
  }
`

function formatDateYYYYMMDD(d: Date) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
}

export default function ServiceBookingPage({
    params,
}: {
    params: Promise<{ serviceId: string }>
}) {
    const { serviceId } = use(params)

    const router = useRouter()

    const [date, setDate] = useState(() => formatDateYYYYMMDD(new Date()))

    const { data, loading, error } = useQuery(AVAILABLE_SLOTS, {
        variables: { serviceId, date },
    })

    const slots: string[] = useMemo(() => data?.availableSlots ?? [], [data])

    return (
        <main className={styles.main}>
            <p className={styles.heading}>Pick a time</p>

            <div className={styles.datePicker}>
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className={styles.timePicker}>
                {loading && <div>Loading slots…</div>}
                {error && <div>Error: {error.message}</div>}

                {!loading && !error && (
                    <div className={styles.slots}>
                        {slots.length === 0 ? (
                            <div>No available slots for this date.</div>
                        ) : (
                            slots.map((iso) => {
                                const t = new Date(iso)
                                const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                                return (
                                    <button
                                        key={iso}
                                        className={styles.slot}
                                        onClick={() => router.push(`/book/${serviceId}/confirm?startAt=${encodeURIComponent(iso)}`)}
                                    >
                                        {label}
                                    </button>
                                )
                            })
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}
