import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import DynamicDropdown, { OptionObject, DynamicDropdownPresentationProps } from "@insite/mobius/DynamicDropdown";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { SelectPresentationProps } from "@insite/mobius/Select";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import searchProducts from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SearchProducts";
import setProduct from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SetProduct";
import changeProductUnitOfMeasure from "@insite/client-framework/Store/CommonHandlers/ChangeProductUnitOfMeasure";
import debounce from "lodash/debounce";
import { getProductSelector } from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorSelectors";

interface OwnProps {
    onSelectProduct: (product: ProductModelExtended) => void;
    selectButtonTitle?: string;
    productIsConfigurableMessage?: React.ReactNode;
    productIsUnavailableMessage?: React.ReactNode;
}

const mapStateToProps = (state: ApplicationState) => {
    const { isSearching, searchResults, selectedProduct, errorType } = getProductSelector(state);
    return ({
        isSearching,
        searchResults,
        selectedProduct,
        errorType,
    });
};

const mapDispatchToProps = {
    searchProducts,
    setProduct,
    changeProductUnitOfMeasure,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductSelectorStyles {
    container?: GridContainerProps;
    searchGridItem?: GridItemProps;
    qtyGridItem?: GridItemProps;
    unitOfMeasureGridItem?: GridItemProps;
    buttonGridItem?: GridItemProps;
    unitOfMeasureSelect?: SelectPresentationProps;
    qtyTextField?: TextFieldPresentationProps;
    optionWrapper?: InjectableCss;
    imageWrapper?: InjectableCss;
    productImage?: LazyImageProps;
    infoWrapper?: InjectableCss;
    autocompleteTitleText?: TypographyPresentationProps;
    autocompleteErpText?: TypographyPresentationProps;
    selectButton?: ButtonPresentationProps;
    searchDynamicDropdown?: DynamicDropdownPresentationProps;
}

const styles: ProductSelectorStyles = {
    container: {
        gap: 10,
    },
    searchGridItem: {
        width: [12, 12, 4, 4, 4],
    },
    qtyGridItem: {
        width: [3, 3, 2, 1, 1],
    },
    unitOfMeasureGridItem: {
        width: [9, 9, 3, 2, 2],
    },
    buttonGridItem: {
        width: [12, 12, 3, 5, 5],
    },
    optionWrapper: {
        css: css`
            display: flex;
            cursor: pointer;
        `,
    },
    imageWrapper: {
        css: css`
            display: flex;
            width: 50px;
            height: 50px;
            margin-right: 10px;
        `,
    },
    productImage: {
        width: "50px",
        css: css`
            flex-shrink: 0;
            img {
                height: 100%;
            }
        `,
    },
    infoWrapper: {
        css: css` 
            display: flex;
            flex-direction: column;
        `,
    },
    autocompleteTitleText: {
        size: 14,
    },
    autocompleteErpText: {
        size: 14,
        css: css` margin-top: 5px; `,
    },
    selectButton: {
        css: css`
            margin-top: 30px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [null, css` width: 100%; `], "max")}
        `,
    },
    searchDynamicDropdown: {
        cssOverrides: {
            selectedText: css`
                width: 100%;
                overflow: hidden;
            `,
        },
    },
};

const ENTER_KEY = 13;

const ProductSelector: React.FC<Props> = ({
    onSelectProduct,
    selectButtonTitle,
    searchProducts,
    isSearching,
    searchResults,
    setProduct,
    selectedProduct,
    errorType,
    changeProductUnitOfMeasure,
    ...otherProps
}) => {
    const [qty, setQty] = React.useState("1");
    const [errorMessage, setErrorMessage] = React.useState<React.ReactNode>("");
    const [selectedProductId, setSelectedProductId] = React.useState("");
    const [options, setOptions] = React.useState<OptionObject[]>([]);

    React.useEffect(() => {
        if (!searchResults) {
            return;
        }

        const newOptions = searchResults.map(product => ({
            optionText: product.title,
            optionValue: product.id || undefined,
            rowChildren: <StyledWrapper {...styles.optionWrapper}>
                <StyledWrapper {...styles.imageWrapper}>
                    <LazyImage {...styles.productImage} src={product.image} />
                </StyledWrapper>
                <StyledWrapper {...styles.infoWrapper}>
                    <Typography {...styles.autocompleteTitleText}>{product.title}</Typography>
                    <Typography {...styles.autocompleteErpText}>{product.erpNumber}</Typography>
                </StyledWrapper>
            </StyledWrapper>,
        }));
        setOptions(newOptions);
    }, [searchResults]);

    React.useEffect(() => {
        setSelectedProductId(selectedProduct ? selectedProduct.id : "");
    }, [selectedProduct]);

    React.useEffect(() => {
        switch (errorType) {
            case "productIsConfigurable":
                setErrorMessage(otherProps.productIsConfigurableMessage || translate("Cannot select configurable products"));
                break;
            case "productIsUnavailable":
                setErrorMessage(otherProps.productIsUnavailableMessage || translate("Product is unavailable"));
                break;
            default:
                setErrorMessage("");
                break;
        }
    }, [errorType]);

    const onSelectionChangeHandler = (value?: string) => {
        if (searchResults && searchResults.length > 0) {
            setProduct({ productId: value, validateProduct: true });
        }
    };

    const debouncedSearchProducts = debounce((query: string) => {
        searchProducts({ query });
    }, 300);

    const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");

        if (selectedProduct) {
            setProduct({});
        }

        debouncedSearchProducts(event.target.value);
    };

    const selectProduct = () => {
        if (!selectedProduct || errorMessage) {
            return;
        }

        const newProduct = { ...selectedProduct };
        newProduct.qtyOrdered = Math.max(Number(qty) || 1, selectedProduct.minimumOrderQty || 1);
        onSelectProduct(newProduct);

        setProduct({});
        setQty("1");
        searchProducts({ query: "" });
    };

    const onSuccessUomChanged = (product: ProductModelExtended) => {
        setProduct({ product });
    };

    const uomChangeHandler = (value: string) => {
        if (!selectedProduct) {
            return;
        }

        changeProductUnitOfMeasure({ product: selectedProduct, selectedUnitOfMeasure: value, onSuccess: onSuccessUomChanged });
    };

    const onKeyPress = (event: React.KeyboardEvent) => {
        if (event.charCode === ENTER_KEY) {
            if (selectedProduct) {
                selectProduct();
            } else if (searchResults && searchResults.length === 1) {
                const productId = searchResults[0].id ?? "";
                setProduct({ productId, validateProduct: true });
            }
        }
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.searchGridItem} data-test-selector="productSelector_search">
                <DynamicDropdown
                    {...styles.searchDynamicDropdown}
                    label={translate("Search")}
                    onSelectionChange={onSelectionChangeHandler}
                    onInputChange={onInputChanged}
                    onKeyPress={onKeyPress}
                    filterOption={() => true}
                    selected={selectedProductId}
                    isLoading={isSearching}
                    options={options}
                    error={errorMessage}
                />
            </GridItem>
            <GridItem {...styles.qtyGridItem}>
                <TextField
                    type="number"
                    min={1}
                    label={translate("QTY")}
                    value={qty}
                    onChange={(e) => { setQty(e.currentTarget.value); }}
                />
            </GridItem>
            <GridItem {...styles.unitOfMeasureGridItem}>
                {selectedProduct && selectedProduct.unitOfMeasures && selectedProduct.unitOfMeasures.length > 0
                    && <ProductUnitOfMeasureSelect
                        productUnitOfMeasures={selectedProduct.unitOfMeasures}
                        selectedUnitOfMeasure={selectedProduct.selectedUnitOfMeasure}
                        onChangeHandler={uomChangeHandler}
                        extendedStyles={styles.unitOfMeasureSelect}
                    />
                }
            </GridItem>
            <GridItem {...styles.buttonGridItem} data-test-selector="productSelector_selectProduct">
                <Button
                    {...styles.selectButton}
                    onClick={() => selectProduct()}
                    disabled={!selectedProduct || !!errorMessage || Number(qty) < 1}
                >
                    {selectButtonTitle || translate("Select Product")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelector);
