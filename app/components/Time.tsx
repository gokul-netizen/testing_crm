"use client";

import { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

type Props = {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
};

export default function TimePickerDemo({
  value,
  onChange,
}: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-44">
        <TimePicker
          label="Reminder"
          value={value}
          onChange={onChange}
          ampm
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              sx: {
                "& .MuiOutlinedInput-root": {
                  height: 36,
                  borderRadius: "10px",
                  backgroundColor: "#fff",
                  fontSize: "14px",
                },
                "& .MuiInputBase-input": {
                  padding: "8px 10px",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "13px",
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "18px",
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}