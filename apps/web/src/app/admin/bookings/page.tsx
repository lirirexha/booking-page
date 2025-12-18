'use client'

import { gql, useMutation, useQuery } from '@apollo/client'

const BOOKINGS = gql`
  query Bookings {
    bookings {
      id
      customerName
      customerEmail
      startAt
      endAt
      status
      service {
        name
      }
    }
  }
`

const CANCEL = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`

export default function AdminBookingsPage() {
  const { data, loading, error, refetch } = useQuery(BOOKINGS)
  const [cancelBooking, { loading: cancelling }] = useMutation(CANCEL)

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>
  if (error) return <div style={{ padding: 24 }}>Error: {error.message}</div>

  const bookings = data?.bookings ?? []

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin · Bookings</h1>

      <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
        {bookings.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No bookings yet.</div>
        ) : (
          bookings.map((b: any) => {
            const start = new Date(b.startAt)
            const end = new Date(b.endAt)

            return (
              <div
                key={b.id}
                style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: 12,
                  padding: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {b.service.name} · {start.toLocaleString()} –{' '}
                    {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ opacity: 0.8, marginTop: 4 }}>
                    {b.customerName} · {b.customerEmail} · <strong>{b.status}</strong>
                  </div>
                </div>

                <button
                  disabled={cancelling || b.status !== 'CONFIRMED'}
                  onClick={async () => {
                    await cancelBooking({ variables: { id: b.id } })
                    await refetch()
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid #e5e5e5',
                    background: b.status === 'CONFIRMED' ? 'white' : '#f5f5f5',
                    cursor: b.status === 'CONFIRMED' ? 'pointer' : 'not-allowed',
                  }}
                >
                  Cancel
                </button>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}
