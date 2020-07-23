import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import closeVariantModal from "@insite/client-framework/Store/Components/ProductSelector/Handlers/CloseVariantModal";
import setProduct from "@insite/client-framework/Store/Components/ProductSelector/Handlers/SetProduct";
import updateVariantSelection from "@insite/client-framework/Store/Components/ProductSelector/Handlers/UpdateVariantSelection";
import { getProductSelector } from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorSelectors";
import translate from "@insite/client-framework/Translate";
import { VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import ProductPrice from "@insite/content-library/Components/ProductPrice";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: ProductSelectorVariantModalStyles;
}

const mapStateToProps = (state: ApplicationState) => {
    const { variantModalIsOpen, variantParentProduct, selectedVariant, variantSelection, filteredVariantTraits } = getProductSelector(state);
    return ({
        variantModalIsOpen,
        variantParentProduct,
        selectedVariant,
        variantSelection,
        filteredVariantTraits,
    });
};

const mapDispatchToProps = {
    closeVariantModal,
    updateVariantSelection,
    setProduct,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductSelectorVariantModalStyles {
    modal?: ModalPresentationProps;
    wrapper?: InjectableCss;
    variantSelect?: SelectProps;
    selectButton?: ButtonPresentationProps;
}

export const quickOrderVariantModalStyles: ProductSelectorVariantModalStyles = {
    modal: {
        size: 400,
        cssOverrides: {
            modalContainer: css` align-items: flex-start; `,
            modalTitle: css` padding: 10px 20px; `,
            modalContent: css` padding: 20px; `,
        },
    },
    variantSelect: {
        labelPosition: "left",
        labelProps: {
            css: css`
                width: 25%;
                text-align: left;
            `,
        },
        cssOverrides: {
            formField: css` margin-bottom: 10px; `,
            formInputWrapper: css` width: 75%; `,
        },
    },
    selectButton: {
        css: css`
            width: 100%;
            margin-top: 10px;
        `,
    },
};

const ProductSelectorVariantModal: React.FC<Props> = ({
    variantModalIsOpen,
    variantParentProduct,
    selectedVariant,
    variantSelection,
    filteredVariantTraits,
    extendedStyles,
    closeVariantModal,
    updateVariantSelection,
    setProduct,
}) => {
    if (!filteredVariantTraits || filteredVariantTraits.length === 0) {
        return null;
    }

    const [styles] = React.useState(() => mergeToNew(quickOrderVariantModalStyles, extendedStyles));

    const closeModalHandler = () => {
        closeVariantModal();
    };

    const variantChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>, index: number, variantTrait: VariantTraitModel) => {
        const traitValue = variantTrait.traitValues!.find(item => `${item.id}` === event.currentTarget.value);
        updateVariantSelection({ index, traitValue });
    };

    const selectButtonClickHandler = () => {
        setProduct({
            productId: variantParentProduct?.id,
            variantId: selectedVariant?.id,
            validateProduct: true,
        });
        closeVariantModal();
    };

    return <Modal
        {...styles.modal}
        headline={translate("Select options")}
        isOpen={variantModalIsOpen}
        handleClose={closeModalHandler}
    >
        <StyledWrapper {...styles.wrapper}>
            {filteredVariantTraits.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((variantTrait, index) =>
                <Select
                    {...styles.variantSelect}
                    key={variantTrait.id.toString()}
                    label={variantTrait.nameDisplay}
                    value={variantSelection[index] ? `${variantSelection[index]!.id}` : ""}
                    onChange={(event) => { variantChangeHandler(event, index, variantTrait); }}
                >
                    <option value="">{variantTrait.unselectedValue ? variantTrait.unselectedValue : `${translate("Select")} ${variantTrait.nameDisplay}`}</option>
                    {variantTrait.traitValues?.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(traitValue =>
                        <option value={`${traitValue.id}`} key={`${traitValue.id}`}>{traitValue.valueDisplay}</option>)
                    }
                </Select>)
            }
        </StyledWrapper>
        {selectedVariant && selectedVariant.id
            && <ProductPrice product={selectedVariant} showLabel={false} />
        }
        <Button {...styles.selectButton} disabled={!selectedVariant || !selectedVariant.id} onClick={selectButtonClickHandler}>
            {translate("Select")}
        </Button>
    </Modal>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelectorVariantModal);
