const translate = (text: string, ...replacementValues: readonly string[]): string => {
    if (!text) {
        return "";
    }

    return replacer(text.split("_")[0], replacementValues);
};

const replacer = (text: string, replacementValues: readonly string[]) => {
    return replacementValues.reduce((accumulator, replacementValue, replacementIndex) => {
        return accumulator.replace(`{${replacementIndex}}`, replacementValue);
    }, text);
};

export default translate;
