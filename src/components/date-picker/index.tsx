import { memo } from "react";
import { useLocation } from "react-router-dom";

import ReactDatePicker from "react-datepicker";

import style from "./container.module.scss";

const DatePicker = ({
  label,
  startDate,
  handleChange,
}: {
  label: string;
  startDate: any;
  handleChange: ({ date }: { date: any }) => void;
}) => {
  return (
    <>
      <label htmlFor="">{label}</label>
      <ReactDatePicker
        showIcon
        timeInputLabel="Time:"
        name="From date"
        selected={startDate}
        onChange={(date) => handleChange({ date })}
      />
    </>
  );
};

export default memo(DatePicker);
