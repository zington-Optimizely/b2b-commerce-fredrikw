import parse from "html-react-parser";
import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import Accordion, { AccordionProps } from "@insite/mobius/Accordion";
import AccordionSection, { AccordionSectionPresentationProps } from "@insite/mobius/AccordionSection";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { IconMemo, IconProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { css } from "styled-components";
import File from "@insite/mobius/Icons/File";
import { connect } from "react-redux";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";

const enum fields {
    showDocuments = "showDocuments",
    showAttributes = "showAttributes",
}

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    documents: state.pages.productDetail.product?.documents,
    attributeTypes: state.pages.productDetail.product?.attributeTypes,
    specifications: state.pages.productDetail.product?.specifications,
});

export interface ProductDetailsSpecificationsStyles {
    specificationsAccordion?: AccordionProps;
    specificationsAccordionSection?: AccordionSectionPresentationProps;
    documentsContainer?: GridContainerProps;
    documentGridItem?: GridItemProps;
    documentLink?: LinkPresentationProps;
    documentIcon?: IconProps;
    documentNameText?: TypographyPresentationProps;
    attributeTypeWrapper?: InjectableCss;
    attributeTypeLabelText?: TypographyPresentationProps;
    attributeTypeValuesText?: TypographyPresentationProps;
}

const styles: ProductDetailsSpecificationsStyles = {
    specificationsAccordion: {
        headingLevel: 2,
    },
    documentGridItem: {
        width: [12, 12, 6, 6, 6],
    },
    documentIcon: {
        src: File,
        color: "text.link",
        css: css` margin-right: 10px; `,
    },
    documentNameText: {
        css: css` vertical-align: super; `,
    },
    attributeTypeLabelText: {
        weight: "bold",
    },
};

export const specificationsStyles = styles;

const ProductDetailsSpecifications: React.FC<OwnProps> = ({
    product,
    documents,
    attributeTypes,
    specifications,
    fields: { showDocuments, showAttributes },
}) => {
    const renderingDocuments = showDocuments && documents && documents.length > 0;
    const renderingAttributes = showAttributes && (product.brand || attributeTypes);
    if (!renderingDocuments && !renderingAttributes && (!specifications?.length)) {
        return null;
    }

    return <Accordion headingLevel={2} data-test-selector="productDetails_specifications" {...styles.specificationsAccordion}>
        {renderingDocuments
            && <AccordionSection
                title={translate("Documents")}
                data-test-selector="productDetails_specifications_documents"
                expanded={true}
                {...styles.specificationsAccordionSection}
            >
                <GridContainer {...styles.documentsContainer}>
                    {documents!.map(document =>
                        <GridItem key={document.id.toString()} {...styles.documentGridItem}>
                            <Link href={document.filePath} target="_new" {...styles.documentLink} data-test-selector={`productDetails_${document.id}`}>
                                <IconMemo {...styles.documentIcon} />
                                <Typography {...styles.documentNameText}>{document.name}</Typography>
                            </Link>
                        </GridItem>)
                    }
                </GridContainer>
            </AccordionSection>
        }
        {renderingAttributes
            && <AccordionSection
                title={translate("Attributes")}
                expanded={!renderingDocuments}
                data-test-selector="productDetails_specifications_attributes"
                {...styles.specificationsAccordionSection}
            >
                {product.brand
                    && <StyledWrapper {...styles.attributeTypeWrapper}>
                        <Typography {...styles.attributeTypeLabelText}>{translate("Brand")}:&nbsp;</Typography>
                        <Typography {...styles.attributeTypeValuesText}>{product.brand.name}</Typography>
                    </StyledWrapper>
                }
                {attributeTypes && attributeTypes.map(attributeType =>
                    <StyledWrapper {...styles.attributeTypeWrapper} key={attributeType.id.toString()}>
                        <Typography {...styles.attributeTypeLabelText}>{attributeType.label}:&nbsp;</Typography>
                        <Typography {...styles.attributeTypeValuesText}>
                            {attributeType.attributeValues!.map(attributeValue => attributeValue.valueDisplay).join(", ")}
                        </Typography>
                    </StyledWrapper>)
                }
            </AccordionSection>
        }
        {specifications && specifications.map((specification, index) =>
            <AccordionSection
                expanded={index === 0 && !renderingDocuments && !renderingAttributes}
                key={specification.id.toString()}
                title={specification.nameDisplay}
                data-test-selector="productDetails_specifications_specification"
                {...styles.specificationsAccordionSection}
            >
                {parse(specification.htmlContent, parserOptions)}
            </AccordionSection>)
        }
    </Accordion>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsSpecifications)),
    definition: {
        displayName: "Specification",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        fieldDefinitions: [
            {
                name: fields.showDocuments,
                displayName: "Show Documents",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.showAttributes,
                displayName: "Show Attributes",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                sortOrder: 2,
            },
        ],
    },
};

export default widgetModule;
