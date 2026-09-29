'use client'

import { deleteAccount, updatePassword } from '@/app/actions/auth'
import Input from '@/app/components/ui/Input'
import { redirect } from 'next/navigation'
import { useState } from 'react'

export default function SettingsPage() {
  // Mot de passe
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null)
  const [pwdError, setPwdError] = useState<string | null>(null)

  // Suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError(null)
    setPwdSuccess(null)

    if (newPassword !== confirmPassword) {
      setPwdError('Les nouveaux mots de passe ne correspondent pas.')
      return
    }

    setPwdLoading(true)

    try {
      const res = await updatePassword(
        currentPassword,
        newPassword,
        confirmPassword
      )

      if (!res.success) {
        setPwdError(res.error)
      } else {
        setPwdSuccess(res.message)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setPwdError('Une erreur est survenue.')
    } finally {
      setPwdLoading(false)
    }
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteError(null)
    setDeleteLoading(true)

    try {
      const res = await deleteAccount(deleteConfirmPassword)

      if (!res.success) {
        setDeleteError(res.error)
      } else {
        redirect('/')
      }
    } catch {
      setDeleteError('Une erreur est survenue.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-10 sm:px-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Paramètres du compte
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez votre sécurité et vos préférences de compte.
        </p>
      </div>

      {/* Section Mot de passe */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground">
          Changer le mot de passe
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Mot de passe actuel
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Nouveau mot de passe
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
              Confirmer le nouveau mot de passe
            </label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div>

          {pwdError && (
            <p className="rounded-xl border border-danger/20 bg-danger-bg p-3 text-xs font-medium text-danger">
              {pwdError}
            </p>
          )}

          {pwdSuccess && (
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-600">
              {pwdSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="w-full rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
          >
            {pwdLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
      </section>

      {/* Section Zone Dangereuse */}
      <section className="space-y-4 rounded-2xl border border-danger/30 bg-danger-bg/10 p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-danger">Zone dangereuse</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            La suppression de votre compte est définitive. Tous vos liens seront
            supprimés définitivement.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="rounded-xl border border-danger/30 bg-danger-bg px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/20"
        >
          Supprimer mon compte
        </button>
      </section>

      {/* Modal de Confirmation de Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Êtes-vous absolument sûr ?
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Cette action ne peut pas être annulée. Entrez votre mot de passe
                pour confirmer la suppression définitive de votre compte.
              </p>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Mot de passe
                </label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              {deleteError && (
                <p className="rounded-xl border border-danger/20 bg-danger-bg p-3 text-xs font-medium text-danger">
                  {deleteError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmPassword('')
                    setDeleteError(null)
                  }}
                  className="rounded-xl border border-border bg-card-muted px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="rounded-xl border border-danger/30 bg-danger px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                >
                  {deleteLoading
                    ? 'Suppression...'
                    : 'Confirmer la suppression'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
