import { Button } from "@/components/ui/button";

type FormToolbarProps = {
  formId: string;
  isDirty: boolean;
  isPending: boolean;
  onCancel: () => void;
};

export function FormToolbar({
  formId,
  isDirty,
  isPending,
  onCancel,
}: FormToolbarProps) {
  return (
    <div
      aria-label="Form actions"
      className="ml-auto flex items-center gap-2"
      role="group"
    >
      <Button
        className="w-full sm:w-auto"
        disabled={isPending}
        onClick={onCancel}
        type="button"
        variant="ghost"
      >
        Cancel
      </Button>
      <Button
        className="w-full sm:w-auto"
        disabled={!isDirty || isPending}
        form={formId}
        type="submit"
      >
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </div>
  );
}
