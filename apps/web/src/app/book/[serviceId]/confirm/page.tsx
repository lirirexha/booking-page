'use client'

import { gql, useMutation } from '@apollo/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, use, useMemo } from 'react'
import styles from './page.module.css'

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      startAt
      endAt
      service {
        id
        name
      }
    }
  }
`

export default function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ serviceId: string }>
}) {
  const { serviceId } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()

  const startAt = searchParams.get('startAt')

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  const startLabel = useMemo(() => {
    if (!startAt) return null
    const d = new Date(startAt)
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleString([], { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }, [startAt])

  const [createBooking, { loading, error, data }] = useMutation(CREATE_BOOKING)

  if (!startAt || !startLabel) {
    return (
      <main className={styles.main}>
        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Missing time slot</h1>
        <p style={{ opacity: 0.8 }}>Please go back and select a time slot.</p>
        <button
          onClick={() => router.push(`/book/${serviceId}`)}
          style={{ marginTop: 12, padding: 12, borderRadius: 12, border: '1px solid #e5e5e5', background: 'white' }}
        >
          Back
        </button>
      </main>
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await createBooking({
      variables: {
        input: {
          serviceId,
          startAt,
          customerName,
          customerEmail,
          customerPhone: customerPhone || null,
        },
      },
    })
  }

  // Success view
  if (data?.createBooking?.id) {
    return (
      <main className={styles.main}>
        <p className={styles.heading}>Booking confirmed ✅</p>
        <p className={styles.dateAndTime}>
          <strong>{data.createBooking.service.name}</strong>
          <br />
          {new Date(Number(data.createBooking.startAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
          {new Date(Number(data.createBooking.endAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>

        <button
          onClick={() => router.push('/book')}
          className={styles.bookAnother}
        >
          Book another
        </button>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <p className={styles.heading}>Confirm booking</p>
      <p className={styles.selectedTime}>Selected time: {startLabel}</p>

      <form onSubmit={onSubmit} className={styles.confirmationForm}>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Full name"
          required
        />

        <input
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />

        <input
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Phone (optional)"
        />

        {error && (
          <div>
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Booking…' : 'Confirm booking'}
        </button>
      </form>
    </main>
  )
}
