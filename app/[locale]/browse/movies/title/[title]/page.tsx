import React from 'react'

export default function page({ params }: { params: { title: string } }) {
  return (
    <div>
      {params.title}
    </div>
  )
}
