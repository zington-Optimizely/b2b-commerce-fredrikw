const translate = (text: string): string => {
    if (!text) {
        return "";
    }
    return text.split("_")[0];
};

export default translate;
