import type { Dispatch, ReactElement, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export type FormControlItem = {
  name: string;
  label: string;
  componentType: "input" | "select" | "textarea";
  type?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
};

function FormControls<T extends Record<string, string>>({
  formControls,
  formData,
  setFormData,
}: {
  formControls: FormControlItem[];
  formData: T;
  setFormData: Dispatch<SetStateAction<T>>;
}) {
  function renderElement(controlItem: FormControlItem) {
    let elemet: ReactElement | null = null;
    const currentControlItemValue = formData[controlItem.name] || "";

    switch (controlItem.componentType) {
      case "input":
        elemet = (
          <Input
            id={controlItem.name}
            name={controlItem.name}
            placeholder={controlItem.placeholder || "Enter"}
            type={controlItem.type}
            value={currentControlItemValue}
            onChange={(e) => {
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              });
            }}
          />
        );
        break;
      case "select":
        elemet = (
          <Select
            onValueChange={(value) => {
              setFormData({ ...formData, [controlItem.name]: value });
            }}
            value={currentControlItemValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options && controlItem.options.length > 0
                ? controlItem.options.map((optionItem) => (
                    <SelectItem value={optionItem.value} key={optionItem.value}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        elemet = (
          <Textarea
            id={controlItem.name}
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            value={currentControlItemValue}
            onChange={(e) => {
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              });
            }}
          />
        );
        break;
      default:
        elemet = (
          <Input
            id={controlItem.name}
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            type={controlItem.type || "Enter"}
            value={currentControlItemValue}
            onChange={(e) => {
              setFormData({
                ...formData,
                [controlItem.name]: e.target.value,
              });
            }}
          />
        );
    }
    return elemet;
  }
  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controlItem) => (
        <div key={controlItem.name} className="mb-2 flex flex-col gap-2">
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderElement(controlItem)}
        </div>
      ))}
    </div>
  );
}

export default FormControls;
