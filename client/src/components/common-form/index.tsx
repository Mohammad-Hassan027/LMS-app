import type { Dispatch, SetStateAction, FormEvent } from "react";
import { Button } from "../ui/button";
import FormControls, { type FormControlItem } from "./FormControls";

interface CommonFormProps<T extends Record<string, string>> {
  formControls: FormControlItem[];
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  btnText?: string;
}

function CommonForm<T extends Record<string, string>>({
  formControls,
  formData,
  setFormData,
  onSubmit,
  btnText = "Submit",
}: CommonFormProps<T>) {
  return (
    <form onSubmit={onSubmit}>
      <FormControls
        formData={formData}
        setFormData={setFormData}
        formControls={formControls}
      />
      {onSubmit && (
        <Button className="mt-2 px-6 py-4" type="submit">
          {btnText}
        </Button>
      )}
    </form>
  );
}

export default CommonForm;
