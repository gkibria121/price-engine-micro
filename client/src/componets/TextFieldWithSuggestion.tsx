import React, { useState, useRef, useEffect } from "react";
import TextField from "./form/TextField";
import { RefCallBack } from "react-hook-form";

type Option = {
  label: string | number;
  value: string | number;
};

type TextFieldProps = {
  error?: string | string[];
  label?: string;
  step?: string;
  variant?: "floating" | "stacked";
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  isTextArea?: boolean;
  defaultValue?: string;
  readonly?: boolean;
  options: Option[];
  onSuggestionClick: (value: string) => void;
} & (React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  ref?: RefCallBack;
});

const TextFieldWithSuggestion: React.FC<TextFieldProps> = ({
  error,
  label,
  step,
  type = "text",
  placeholder,
  isTextArea = false,
  defaultValue,
  readonly = false,
  options = [],
  onSuggestionClick,
  ...others
}) => {
  const [showSug, setSug] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSugSelect = (value: string | number) => {
    onSuggestionClick(value.toString());
    setSug(false);
  };

  const handleFocus = () => setSug(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSug(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <TextField
        label={label}
        variant="stacked"
        placeholder={placeholder}
        step={step}
        type={type}
        className="mb-0"
        defaultValue={defaultValue}
        isTextArea={isTextArea}
        readonly={readonly}
        error={error}
        {...others}
        onFocus={handleFocus}
      />

      {showSug && (
        <div className="absolute w-full bg-white mt-1 border border-gray-200 rounded shadow-sm z-10 max-h-60 overflow-y-auto">
          {options.map((op) => (
            <div
              key={op.value}
              className="py-2 px-3 hover:bg-blue-600 cursor-pointer text-gray-800 hover:text-white text-sm border-b border-gray-100"
              onClick={() => handleSugSelect(op.value)}
            >
              {op.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextFieldWithSuggestion;
