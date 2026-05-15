'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DraftExpiredDialogProps {
  open: boolean
  onRestore: () => void
  onStartFresh: () => void
}

export function DraftExpiredDialog({ open, onRestore, onStartFresh }: DraftExpiredDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-border bg-[#1E293B] text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Restore or start fresh?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            You have a saved draft that is more than 7 days old. Would you like to restore it or start with a blank canvas?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80" onClick={onStartFresh}>
            Start fresh
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onRestore()
            }}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Restore draft
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}