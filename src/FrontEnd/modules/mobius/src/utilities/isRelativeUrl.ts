const urlTest = new RegExp("^(?:[a-z]+:)?//", "i");

const isRelativeUrl = (url: string) => {
    return !urlTest.test(url);
};

export default isRelativeUrl;
