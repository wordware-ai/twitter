import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cleanUsername = (input: string) => {
  // Remove https:// or http:// if present
  let cleaned = input.replace(/^(https?:\/\/)?(www\.)?/, '')

  // Remove twitter.com/ or x.com/ if present
  cleaned = cleaned.replace(/^(twitter\.com\/|x\.com\/)/, '')

  // Remove @ if present at the start
  cleaned = cleaned.replace(/^@/, '')

  cleaned = cleaned.split('/').pop() || ''

  return cleaned.trim()
}

export const extractDescription = ({ fullProfile }: { fullProfile: unknown }) => {
  if (typeof fullProfile !== 'object' || fullProfile === null) return ''

  const description = (fullProfile as any).description || ''
  const entities = (fullProfile as any).entities?.description

  if (!entities?.urls) return description

  return entities.urls.reduce((newDescription: string, url: any) => {
    return newDescription.replace(url.url, url.display_url)
  }, description)
}
