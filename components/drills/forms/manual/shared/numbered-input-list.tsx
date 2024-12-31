"use client";

import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { UseFieldArrayReturn } from "react-hook-form";

interface NumberedInputListProps {
  label: string;
  tooltip: string;
  addButtonText: string;
  placeholder: string;
  fieldArray: {
    fields: { id: string; value: string }[]; // Expect normalized fields
    append: UseFieldArrayReturn["append"];
    remove: UseFieldArrayReturn["remove"];
  };
  onChangeAction: (index: number, value: string) => void;
  className?: string;
}

export function NumberedInputList({
  label,
  tooltip,
  addButtonText,
  placeholder,
  fieldArray,
  onChangeAction,
  className,
}: NumberedInputListProps) {
  const { fields, append, remove } = fieldArray;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <FormLabel>{label}</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ id: `${Date.now()}`, value: "" })}
        >
          <Plus />
          {addButtonText}
        </Button>
      </div>

      {/* List */}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-4">
          <Input
            value={field.value}
            placeholder={placeholder}
            onChange={(e) => onChangeAction(index, e.target.value)}
          />
          <Button type="button" onClick={() => remove(index)}>
            <X />
          </Button>
        </div>
      ))}

      {fields.length === 0 && <p>No items added yet.</p>}
    </div>
  );
}
