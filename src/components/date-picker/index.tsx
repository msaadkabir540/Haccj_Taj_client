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
  handleChange: (date: Date | null) => void; // Adjust the type of handleChange function
}) => {
  return (
    <>
      <div className={style.dateContainer}>
        <div>
          <label htmlFor="" className={style.labels}>
            {label}
          </label>
        </div>
        <ReactDatePicker
          isClearable={true}
          className={style.datePicker}
          showIcon
          placeholderText={`Select ${label}`}
          timeInputLabel="Time:"
          name="From date"
          selected={startDate}
          onChange={(date) => handleChange(date)} // Pass the selected date to handleChange
        />
      </div>
    </>
  );
};

export default memo(DatePicker);
