'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '../actions/auth'

interface UserMenuProps {
  email: string
}

export default function UserMenu({ email }: UserMenuProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setMenuOpen(false)
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err)
    }
  }

  const initialLetter = email ? email.charAt(0).toUpperCase() : '?'

  return (
    <div className="relative" ref={menuRef}>
      {/* Cercle avec la première lettre */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-accent text-sm font-semibold text-accent-foreground uppercase transition hover:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
      >
        {initialLetter}
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-card p-1.5 shadow-lg">
          <div className="border-b border-border-light px-3 py-2">
            <p className="truncate text-xs font-bold text-foreground">
              Mon Compte
            </p>
          </div>

          <Link
            href="/dashboard/settings"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card-muted"
          >
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Profil & Paramètres
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-danger transition hover:bg-danger-bg"
          >
            <svg
              className="h-4 w-4 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}
