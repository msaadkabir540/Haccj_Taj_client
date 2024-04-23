import { memo, KeyboardEvent, useCallback } from "react";

import { InputInterface } from "./input-interface";

import style from "./input.module.scss";

const Input: React.FC<InputInterface> = ({
  min,
  max,
  type,
  step,
  name,
  icon,
  label,
  value,
  accept,
  onClick,
  readOnly,
  infoText,
  register,
  onChange,
  isDisable,
  className,
  iconClass,
  errorClass,
  inputClass,
  placeholder,
  iconEleClass,
  errorMessage,
  required,
  errorMessagefield,
  id,
}) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "e" || event.key === "E") event.preventDefault();
    },
    [type],
  );

  return (
    <div className={`${style.inputContainer} ${className}`}>
      {/* if label is passed, render a label element, otherwise don't render */}

      {label && (
        <label
          style={{
            color: errorMessagefield ? "#ff5050" : " #252733",
          }}
        >
          {label}
        </label>
      )}

      {/* render input and icon */}
      <div style={{ position: "relative" }}>
        <input
          id={id && id}
          min={min ?? undefined}
          max={max ?? undefined}
          name={name || ""}
          step={step || 1}
          type={type || "text"}
          className={inputClass}
          value={value && value}
          required={required || false}
          accept={accept || ""}
          readOnly={readOnly || false}
          disabled={isDisable || false}
          placeholder={placeholder || ""}
          onChange={onChange || (() => {})}
          // onWheel={(e) => e.target.blur()}
          {...(register && !onchange && register(name || ""))}
          onKeyDown={type === "number" ? handleKeyPress : () => {}}
          style={{
            border: errorMessagefield ? "1px solid #ff5050" : "1px solid #C0C0C0",
            ...style,
          }}
        />
        {/* if icon is passed, render an icon element, otherwise don't render */}
        {icon && (
          <div className={`${style.icon} ${iconClass}`}>
            <img
              className={`${iconEleClass}`}
              style={{ cursor: "pointer" }}
              src={icon}
              alt="icon"
              width={28}
              height={28}
              onClick={onClick}
            />
          </div>
        )}
      </div>
      {/*  if errorMessage is passed, render an error message element, otherwise render an info message element */}
      {errorMessage ? (
        <span className={`${style.errorMessage} ${errorClass}`}>{errorMessage}</span>
      ) : (
        <span className={style.message}>{infoText}</span>
      )}
    </div>
  );
};
Input.defaultProps = {
  type: "text",
};

export default memo(Input);
