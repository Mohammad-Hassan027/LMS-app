import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2Icon, RefreshCcw } from "lucide-react";

interface AlertDialogDestructiveProps {
  title: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  isDelete?: boolean;
}

export function AlertDialogDestructive({
  title,
  isOpen,
  setIsOpen,
  onConfirm,
  isDelete = false,
}: AlertDialogDestructiveProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            {isDelete ? (
              <Trash2Icon className="h-6 w-6" />
            ) : (
              <RefreshCcw className="h-6 w-6" />
            )}
          </AlertDialogMedia>
          <AlertDialogTitle>
            {isDelete ? "Delete" : "Replace"} this lecture?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently {isDelete ? "delete" : "replace"} "
            <span className="font-semibold">{title || "Untitled Lecture"}</span>
            " and remove the associated video. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {isDelete ? "Delete" : "Replace"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
