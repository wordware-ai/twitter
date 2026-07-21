/* eslint-disable @next/next/no-img-element */

/**
 * Sauna brand logo — renders the official brand-pack SVGs (https://www.sauna.ai/brand)
 * from /public/brand. `color` maps to the ink (#171814) or white variants; use ink
 * on light backgrounds, white on dark ones.
 */
const SaunaLogo = ({ emblemOnly = false, color, width }: { emblemOnly?: boolean; color: 'white' | 'black'; width: number }) => {
  const variant = color === 'white' ? 'white' : 'ink'

  if (emblemOnly) {
    // Emblem viewBox is 204x250
    return (
      <img
        src={`/brand/sauna-logo-${variant}.svg`}
        alt="Sauna"
        width={width}
        height={Math.round(width * (250 / 204))}
      />
    )
  }

  // Horizontal lockup viewBox is 724x161
  return (
    <img
      src={`/brand/sauna-lockup-horizontal-${variant}.svg`}
      alt="Sauna"
      width={width}
      height={Math.round(width * (161 / 724))}
    />
  )
}

export default SaunaLogo
