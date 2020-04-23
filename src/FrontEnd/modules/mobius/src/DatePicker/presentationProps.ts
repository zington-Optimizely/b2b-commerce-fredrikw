import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

const DatePickerPresentationPropsDefault: ComponentThemeProps["datePicker"]["defaultProps"] = {
    calendarIconProps: {
        color: "text.main",
        css: css` margin-right: -9px; `,
    },
    clearIconProps: {
        color: "text.main",
    },
    cssOverrides: {
        formField: css` width: unset; `,
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
