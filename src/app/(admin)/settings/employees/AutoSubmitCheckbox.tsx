"use client";

import { useRef } from "react";

export function AutoSubmitCheckbox({
  action,
  id,
  name,
  defaultChecked,
  ariaLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  name: string;
  defaultChecked: boolean;
  ariaLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={id} />
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        aria-label={ariaLabel}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-4 w-4"
      />
    </form>
  );
}
