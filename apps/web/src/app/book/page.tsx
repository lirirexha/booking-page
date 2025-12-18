'use client'
import styles from './page.module.css'

import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'

const SERVICES = gql`
  query Services {
    services {
      id
      name
      durationM
      price
    }
  }
`

export default function BookPage() {
  const { data, loading, error } = useQuery(SERVICES)

  if (loading) return <div>Loading…</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <main className={styles.main}>
      <p className={styles.heading}>Book an appointment</p>
      <p>Choose a service to see available times.</p>

      <div className={styles.servicesList}>
        {data.services.map((s: any) => (
          <Link
            key={s.id}
            href={`/book/${s.id}`}
            className={styles.serviceItem}
          >
            <div className={styles.serviceName}>{s.name}</div>
            <div className={styles.serviceDetails}>
              {s.durationM} min
              {typeof s.price === 'number' ? ` • €${(s.price / 100).toFixed(2)}` : ''}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
