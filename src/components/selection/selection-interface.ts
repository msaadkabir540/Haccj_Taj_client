import React, { CSSProperties } from "react";
import { Control, FieldValues } from "react-hook-form";
import { Props } from "react-select";

export interface SelectionInterface {
  id?: string;
  customeMargin?: string;
  customColorSingleValue?: string;
  customMenuWidth?: string;
  singleValueMaxWidth?: string;
  singleValueMinWidth?: string;
  customHeight?: string;
  customBorder?: string;
  costumPaddingLeft?: string;
  customBackgroundColor?: string;
  customWidth?: string;
  paddingLeft?: string;
  customeFontWeight?: string;
  customBoxShadow?: string;
  customeFontSize?: string;
  customPaddingBottom?: string;
  customPadding?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  label?: string | undefined;
  options: OptionType[];
  defaultValue?: OptionType | null;
  iconClass?: React.CSSProperties | undefined | any;
  customeStyles?: React.CSSProperties | undefined | any;
  placeholder?: string | undefined;
  errorMessage?: string;
  onChange?: () => void;
  isMulti?: boolean | undefined;
  customStyles?: boolean | undefined;
  boderCustomeStyle?: boolean | undefined;
  name: string;
  placeholderWidth?: string;
  control: Control<FieldValues | any>;
  showNumber?: number;
  className?: string;
  customFuncOnChange?: (value: string) => void;
}

export interface OptionType {
  value: string | number;
  label: string | number;
}

export interface CustomOptionStyles {
  option: (provided: CSSProperties, state: any) => CSSProperties;
  placeholder: (provided: CSSProperties) => CSSProperties;
  input: (provided: CSSProperties) => CSSProperties;
  control: (provided: CSSProperties, state: Props<any>) => CSSProperties;
  singleValue: (provided: CSSProperties) => CSSProperties;
}
