import React, { memo } from "react";
import ReactSelect from "react-select";
import { Controller } from "react-hook-form";

import style from "./index.module.scss";
import { SelectionInterface } from "./selection-interface";

const Selection = ({
  id,
  label,
  name,
  isMulti,
  options,
  control,
  iconClass,
  className,
  // showNumber,
  isDisabled,
  isSearchable,
  placeholder,
  errorMessage,
  defaultValue,
  // styles
  customHeight,
  paddingLeft,
  customStyles,
  customWidth,
  customPadding,
  customeMargin,
  customeStyles,
  customBorder,
  customBoxShadow,
  customMenuWidth,
  customeFontSize,
  costumPaddingLeft,
  placeholderWidth,
  boderCustomeStyle,
  customeFontWeight,
  customPaddingBottom,
  singleValueMaxWidth,
  singleValueMinWidth,
  customBackgroundColor,
  customColorSingleValue,
  customFuncOnChange,
}: SelectionInterface) => {
  const customStyle = {
    option: (provided: any, state: any) => ({
      ...provided,
      color: state?.isSelected ? "black" : "black",
      backgroundColor: state?.isSelected ? "#c7c7c9" : "white",
      "&:hover": {
        color: "white",
        backgroundColor: "#c7c7c9",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "black",
      fontSize: customeFontSize || "16px",
      paddingRight: customPadding ? "20px !important" : "",
      whiteSpace: "nowrap",
      width: placeholderWidth,
      overflow: "hidden",
      textOverflow: "ellipsis",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "black",
      margin: customeMargin,
      minHeight: customHeight || "40px",
      maxHeight: customHeight || "40px",
      minWidth: customWidth,
      maxWidth: customWidth,
      paddingBottom: customPaddingBottom ? customPaddingBottom : "2px",
      paddingLeft: paddingLeft ? paddingLeft : "2px",
      fontWeight: customeFontWeight,
    }),
    control: (provided: any) => ({
      ...provided,
      border: customBorder
        ? customBorder
        : customStyles
          ? "1px solid #c0c0c0"
          : "1px solid #c0c0c0",
      borderRadius: customStyles ? "8px" : boderCustomeStyle ? "5px" : "1px",
      minHeight: customHeight || "40px",
      maxHeight: customHeight || "40px",
      minWidth: customWidth,
      maxWidth: customWidth,
      boxShadow: customBoxShadow,
      cursor: "pointer",
      backgroundColor: customBackgroundColor,
      ...customeStyles,
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: "99 !important",
      width: "100% !important ",
      overflowX: "auto",
      maxWidth: customMenuWidth,
      minWidth: customMenuWidth,
      fontSize: customeFontSize,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      maxWidth: singleValueMaxWidth,
      minWidth: singleValueMinWidth,
      fontSize: customeFontSize || "16px",
      color: customColorSingleValue || "black",
      paddingRight: "16px",
      paddingLeft: costumPaddingLeft && costumPaddingLeft,
    }),
    indicatorContainer2: (provided: any) => ({
      ...provided,
      minHeight: customHeight || "40px !important",
      maxHeight: customHeight || "40px !important",
    }),
  };

  return (
    <div className={`${style.container} ${className} `}>
      {label && (
        <label htmlFor={id} className={style.label}>
          {label}
        </label>
      )}
      {control && (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, value } }) => {
            return (
              <ReactSelect
                onChange={(e: { label: string; value: string }) => {
                  customFuncOnChange?.(e?.value);
                  onChange(e);
                }}
                isSearchable={isSearchable}
                isDisabled={isDisabled || false}
                // {...field}
                styles={customStyle}
                options={options}
                placeholder={placeholder}
                instanceId={id}
                isMulti={isMulti}
                value={value}
                isClearable

                // components={{
                //   ...(showNumber && {
                //     MultiValue: (props) => {
                //       const { getValue, data } = props;
                //       const selectedOptions = getValue();
                //       const currentOptionIdx = selectedOptions.findIndex(
                //         (option) => option?.value === data?.value,
                //       );
                //       if (selectedOptions?.length > 1) {
                //         return currentOptionIdx === 0 ? (
                //           <p className={style.pp}>{selectedOptions?.length} Selected</p>
                //         ) : (
                //           <></>
                //         );
                //       } else {
                //         return currentOptionIdx === 0 ? (
                //           <p className={style.pp}>{data?.label}</p>
                //         ) : (
                //           <></>
                //         );
                //       }
                //     },
                //   }),
                // }}
              />
            );
          }}
        />
      )}

      {/* <label htmlFor={id}>
        <div className={`${style.icon} ${iconClass}`}>
          <ImageComponent src={"/assets/down.png"} alt="dropdown" className={style.img} />
        </div>
      </label> */}

      {errorMessage ? <span className={style.errorMessage}>{errorMessage}</span> : ""}
    </div>
  );
};

export default memo(Selection);
