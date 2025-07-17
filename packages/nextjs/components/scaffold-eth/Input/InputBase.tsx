import { ChangeEvent, FocusEvent, useCallback, useEffect, useRef } from "react";

type InputBaseProps<T> = {
  name?: string;
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  reFocus?: boolean;
};

export const InputBase = <T extends { toString: () => string } | undefined = string>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix,
  reFocus,
}: InputBaseProps<T>) => {
  const inputReft = useRef<HTMLInputElement>(null);

  let modifier = "";
  if (error) {
    modifier = "border-red-500/50 bg-red-500/10";
  } else if (disabled) {
    modifier = "border-gray-600 bg-gray-800/50 opacity-50";
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value as unknown as T);
    },
    [onChange],
  );

  // Runs only when reFocus prop is passed, useful for setting the cursor
  // at the end of the input. Example AddressInput
  const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (reFocus !== undefined) {
      e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
    }
  };
  useEffect(() => {
    if (reFocus !== undefined && reFocus === true) inputReft.current?.focus();
  }, [reFocus]);

  return (
    <div
      className={`flex border-2 glass-card bg-white/5 rounded-xl border-white/20 transition-all duration-300 hover:border-cyan-500/30 focus-within:border-cyan-500/50 focus-within:shadow-lg focus-within:shadow-cyan-500/20 ${modifier}`}
    >
      {prefix}
      <input
        className="input input-ghost focus-within:border-transparent focus:outline-hidden focus:bg-transparent h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-white/50 text-white focus:text-white font-rajdhani"
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
        ref={inputReft}
        onFocus={onFocus}
      />
      {suffix}
    </div>
  );
};
