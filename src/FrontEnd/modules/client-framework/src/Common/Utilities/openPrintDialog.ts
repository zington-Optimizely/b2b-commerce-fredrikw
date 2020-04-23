const openPrintDialog = () => {
    if (document.queryCommandSupported("print")) {
        document.execCommand("print", false);
    } else {
        window.print();
    }
};

export default openPrintDialog;
