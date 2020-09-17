import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

const DatePickerPresentationPropsDefault: ComponentThemeProps["datePicker"]["defaultProps"] = {
    calendarIconProps: {
        color: "text.main",
        css: css`
            margin-right: -9px;
        `,
        src: "Calendar",
    },
    clearIconProps: {
        color: "text.main",
        src: "X",
    },
    cssOverrides: {
        formField: css`
            width: unset;
        `,
    },
    dateTimePickerProps: {
        calendarType: "US",
        showLeadingZeros: true,
        showFixedNumberOfWeeks: false,
        showNeighboringMonth: false,
    },
    format: "MM/dd/y",
    placeholders: {
        dayPlaceholder: "dd",
        monthPlaceholder: "mm",
        yearPlaceholder: "yyyy",
        hourPlaceholder: "hr",
        minutePlaceholder: "min",
    },
};

export default DatePickerPresentationPropsDefault;
