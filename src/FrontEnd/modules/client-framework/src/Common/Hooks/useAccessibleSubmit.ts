import { useState, useEffect } from "react";

const enterKey = 13;

const useAccessibleSubmit = (value: string, onSubmit: (value: string) => void) => {
    const [stateValue, setValue] = useState(value);
    const changeHandler = (event: any) => {
        setValue(event.currentTarget.value);
    };

    const keyDownHandler = (event: any) => {
        if (event.keyCode === enterKey) {
            event.stopPropagation();
            onSubmit(stateValue);
        }
    };

    const blurHandler = () => {
        onSubmit(stateValue);
    };

    useEffect(() => {
        setValue(value);
    }, [value]);

    return {
        value: stateValue,
        changeHandler,
        keyDownHandler,
        blurHandler,
    };
};

export default useAccessibleSubmit;
