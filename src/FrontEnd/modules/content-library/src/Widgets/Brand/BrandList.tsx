import isNumeric from "@insite/client-framework/Common/isNumeric";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadBrands from "@insite/client-framework/Store/Pages/Brands/Handlers/LoadAllBrands";
import translate from "@insite/client-framework/Translate";
import { BrandModel, BrandAlphabetLetterModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import VerticalColumnCell, { VerticalColumnCellProps } from "@insite/content-library/Components/VerticalColumnCell";
import VerticalColumnContainer, { VerticalColumnContainerProps } from "@insite/content-library/Components/VerticalColumnContainer";
import { BrandsPageContext } from "@insite/content-library/Pages/BrandsPage";
import BrandAlphabetNavigation, { BrandAlphabetNavigationStyles } from "@insite/content-library/Widgets/Brand/BrandAlphabetNavigation";
import Accordion, { AccordionProps } from "@insite/mobius/Accordion";
import AccordionSection, { AccordionSectionPresentationProps } from "@insite/mobius/AccordionSection";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import { getAllBrandsDataView } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    allBrandsDataView: getAllBrandsDataView(state),
    brandAlphabetState: state.pages.brands.brandAlphabetState,
});

const mapDispatchToProps = {
    loadBrands,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

type BrandLetterMap = {
    [letter: string]: BrandModel[];
};

export interface BrandListStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    container?: InjectableCss;
    brandAlphabetNavigation?: BrandAlphabetNavigationStyles;
    brandAccordion?: AccordionProps;
    brandAccordionSection?: AccordionSectionPresentationProps;
    verticalColumnContainer?: VerticalColumnContainerProps;
    verticalColumnCell?: VerticalColumnCellProps;
    brandLink?: LinkPresentationProps;
    actions?: InjectableCss;
    actionLinks?: LinkPresentationProps;
    backToTopButton?: ButtonPresentationProps;
}

const styles: BrandListStyles = {
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css` margin: auto; `,
    },
    brandAccordionSection: {
        titleTypographyProps: {
            weight: "bold",
            css: css` text-transform: uppercase; `,
        },
    },
    backToTopButton: {
        variant: "secondary",
        sizeVariant: "small",
        css: css`
            float: right;
            margin: 10px;
        `,
    },
    brandLink: {
        css: css` width: 100%; `,
    },
    verticalColumnContainer: {
        columnCounts: [2, 4, 4, 4, 4],
    },
    actions: {
        css: css`
            display: flex;
            justify-content: flex-end;
            padding: 5px;
        `,
    },
    actionLinks: {
        css: css` margin: 5px; `,
    },
};

export const listStyles = styles;

/**
 * This will display all Brands grouped by the first character.
 * Starting with numbers grouped into '#'.
 * @param props
 */
const BrandList: FC<Props> = (props: Props) => {
    const { allBrandsDataView, brandAlphabetState } = props;

    const brandList = allBrandsDataView.value || [];
    const brandAlphabet = brandAlphabetState.value || [];
    const { letters, brandLettersMap } = buildLettersAndMap(brandList);
    const { brandLetterDetails, brandSections } = buildBrandSections(letters, brandLettersMap, brandAlphabet, false);

    const [state, setState] = React.useState<{ expanded: boolean; brandLetterDetails: BrandAlphabetLetterModel[]; brandSections: BrandSection[]}>({ expanded: false, brandLetterDetails, brandSections });

    React.useEffect(() => {
        setState({ ...state, brandLetterDetails, brandSections });
    }, [brandList, brandAlphabetState, brandAlphabet]);

    if (allBrandsDataView.isLoading || brandAlphabetState.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }
    if (brandList.length === 0) {
        return null;
    }

    const onCollapse = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (state.expanded) {
            // TODO ISC-11114 - Needs a managed expanded way to collapse sections.
            const { letters, brandLettersMap } = buildLettersAndMap(brandList);
            const { brandLetterDetails, brandSections } = buildBrandSections(letters, brandLettersMap, brandAlphabet, false);
            setState({ ...state, brandLetterDetails, brandSections, expanded: false });
        }
    };
    const onExpand = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!state.expanded) {
            // TODO ISC-11114 - Needs a managed expanded way to collapse sections.
            const { letters, brandLettersMap } = buildLettersAndMap(brandList);
            const { brandLetterDetails, brandSections } = buildBrandSections(letters, brandLettersMap, brandAlphabet, true);
            setState({ ...state, brandLetterDetails, brandSections, expanded: true });
        }
    };
    const onAccordionClickResetExpandedState = () => {
        const { letters, brandLettersMap } = buildLettersAndMap(brandList);
        const { brandLetterDetails, brandSections } = buildBrandSections(letters, brandLettersMap, brandAlphabet, false);
        setState({ ...state, brandLetterDetails, brandSections, expanded: false });
    };
    const handleBackToTop = () => {
        window.scrollTo(0, 0);
    };
    const handleBrandLetterClick = (letter: string) => {
        // TODO ISC-11114 - Set brand details expanded or trigger expanded on AccordionSection.
    };

    return (
        <StyledWrapper {...styles.container} onClick={onAccordionClickResetExpandedState} data-test-selector="brandList">
            <BrandAlphabetNavigation
                letterDetails={brandLetterDetails}
                extendedStyles={styles.brandAlphabetNavigation}
                onBrandLetterClick={handleBrandLetterClick}
            />
            {/* TODO: ISC-11114 - Hidden till expanded on AccordionSection can be easily triggered
             <StyledWrapper {...styles.actions}>
                <Link onClick={onCollapse} {...styles.actionLinks} data-test-selector="brandListCollapseAllLink">
                    {translate("Collapse All")}
                </Link>
                <Link onClick={onExpand} {...styles.actionLinks} data-test-selector="brandListExpandAllLink">
                    {translate("Expand All")}
                </Link>
            </StyledWrapper> */}
            <Accordion headingLevel={2}>
                {state.brandSections.map(brandDetails => (
                    // TODO ISC-11114 - Manage expand from brandDetails, or ability to trigger expanded.
                    <AccordionSection
                        key={brandDetails.letter}
                        {...styles.brandAccordionSection}
                        title={brandDetails.letter}
                        expanded={brandDetails.expanded}
                    >
                        <VerticalColumnContainer
                            id={`letter-${brandDetails.letter}`}
                            {...styles.verticalColumnContainer}
                            data-test-selector="brandSection"
                        >
                            {brandDetails.brandMap.map(
                                brand => (
                                    <VerticalColumnCell key={brand.detailPagePath} {...styles.verticalColumnCell}>
                                        <Link
                                            {...styles.brandLink}
                                            href={brand.detailPagePath}
                                            typographyProps={{ ellipsis: true }}
                                            data-test-selector="brandLink"
                                        >
                                            {brand.name}
                                        </Link>
                                    </VerticalColumnCell>
                                ),
                            )}
                        </VerticalColumnContainer>
                    </AccordionSection>
                ))}
            </Accordion>
            <Button {...styles.backToTopButton} onClick={handleBackToTop}>
                {translate("Back to top")}
            </Button>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(BrandList),
    definition: {
        group: "Brands",
        icon: "List",
        allowedContexts: [BrandsPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;

interface BrandSection {
    letter: string;
    brandMap: BrandModel[];
    expanded: boolean;
}

/**
 * Takes in a brand list and sorts it into #, A-Z, Other characters.
 *
 * @param brandList The list of brands that should be sorted.
 */
const buildLettersAndMap = (brandList: BrandModel[]): { letters: string[]; brandLettersMap: BrandLetterMap; } => {
    let letters: string[] = [];
    let letter: string;
    let newLetters: string[] = letters;
    const brandLettersMap: BrandLetterMap = {};
    for (let i = 0; i < brandList.length; i = i + 1) {
        const brand = brandList[i];
        letter = brand.name[0] ? brand.name[0].toLowerCase() : "";
        if (isNumeric(letter)) {
            letter = "#";
        }
        if (!brandLettersMap[letter]) {
            brandLettersMap[letter] = [];
        }
        brandLettersMap[letter].push(brand);
        newLetters = [
            ...newLetters,
            letter,
        ];
    }
    letters = newLetters.filter((letter, index, array) => array.indexOf(letter) === index);
    if (brandLettersMap["#"]) {
        brandLettersMap["#"].sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));
    }

    return { letters, brandLettersMap };
};

/**
 * Take in the props and create easier to work with state objects.
 *
 * @param letters List of letters and special characters.
 * @param brandLettersMap Brand list sorted into letter lists.
 * @param brandAlphabet Letter count list.
 * @param expanded The expanded value to use if not undefined.
 */
const buildBrandSections = (letters: string[], brandLettersMap: BrandLetterMap, brandAlphabet: BrandAlphabetLetterModel[], expanded: boolean | undefined): {
    brandLetterDetails: {
        count: number;
        letter: string;
        linkable: boolean;
    }[], brandSections: {
        letter: string;
        brandMap: BrandModel[];
        expanded: boolean;
    }[]
} => {
    const brandLetterDetails = brandAlphabet.map(
        alphabetItem => ({ ...alphabetItem, linkable: alphabetItem.count > 0 }),
    );
    const brandSections = letters.map(letter => ({
        letter,
        brandMap: brandLettersMap[letter],
        expanded: expanded || false,
    }));

    return { brandLetterDetails, brandSections };
};
