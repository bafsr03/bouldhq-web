import Image from 'next/image'

/**
 * The two people a client actually works with. Black-and-white portraits so two
 * photos taken in very different light still read as a pair.
 *
 * Brian's source photo is 200px square, so the portraits are shown small; do
 * not raise the display size without a larger original.
 */
const PEOPLE = [
  { name: 'Jake Knudsen', role: 'Strategy & client calls', photo: '/team/jake.webp' },
  { name: 'Brian Sanchez', role: 'Design & build', photo: '/team/brian.webp' },
]

export default function Team({ heading = 'Who you’ll work with' }: { heading?: string }) {
  return (
    <div className="bould-team">
      <h3 className="bould-team__heading">{heading}</h3>
      <ul className="bould-team__list">
        {PEOPLE.map((p) => (
          <li key={p.name} className="bould-team__person">
            <Image
              src={p.photo}
              alt={`${p.name}, ${p.role}`}
              width={112}
              height={112}
              className="bould-team__photo"
            />
            <div>
              <p className="bould-team__name">{p.name}</p>
              <p className="bould-team__role">{p.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
