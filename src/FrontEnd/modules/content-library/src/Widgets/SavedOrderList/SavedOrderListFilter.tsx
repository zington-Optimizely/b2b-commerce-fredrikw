import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import clearSearch from "@insite/client-framework/Store/Pages/SavedOrderList/Handlers/ClearSearch";
import updateSearchFields from "@insite/client-framework/Store/Pages/SavedOrderList/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { SavedOrderListPageContext } from "@insite/content-library/Pages/SavedOrderListPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    isFilterOpen: state.pages.savedOrderList.isFilterOpen,
    getCartsApiParameter: state.pages.savedOrderList.getCartsApiParameter,
});

const mapDispatchToProps = {
    updateSearchFields,
    clearSearch,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface SavedOrderListFilterStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    heading?: TypographyPresentationProps;
    datesGridItem?: GridItemProps;
    datesContainer?: GridContainerProps;
    dateRangeFieldset?: InjectableCss;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    orderTotalGridItem?: GridItemProps;
    orderTotalContainer?: GridContainerProps;
    orderTotalFieldset?: InjectableCss;
    orderTotalOperatorGridItem?: GridItemProps;
    orderTotalOperatorSelect?: SelectPresentationProps;
    orderTotalAmountGridItem?: GridItemProps;
    orderTotalAmountTextField?: TextFieldPresentationProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonPresentationProps;
}

export const savedOrderListFilterStyles: SavedOrderListFilterStyles = {
    container: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    headingGridItem: {
        width: 12,
        css: css`
            padding-bottom: 0;
        `,
    },
    heading: {
        variant: "h5",
        css: css`
            margin: 0;
        `,
    },
    datesGridItem: {
        css: css`
            padding: 15px 30px;
        `,
        width: [12, 12, 6, 4, 4],
    },
    datesContainer: { gap: 10 },
    dateRangeFieldset: {
        css: css`
            border: none;
            margin: 0;
            padding: 0;
            width: 100%;
        `,
    },
    fromGridItem: { width: 6 },
    toGridItem: { width: 6 },
    appliedFiltersContainer: { css: horizontalStyles },
    buttonsItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    clearFiltersButton: {
        variant: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
    toDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
    orderTotalGridItem: {
        css: css`
            padding: 15px 30px;
        `,
        width: [12, 12, 6, 4, 4],
    },
    orderTotalContainer: { gap: 10 },
    orderTotalFieldset: {
        css: css`
            border: none;
            margin: 0;
            padding: 0;
            width: 100%;
        `,
    },
    orderTotalOperatorGridItem: { width: 6 },
    orderTotalAmountGridItem: { width: 6 },
    orderTotalAmountTextField: {
        cssOverrides: {
            formInputWrapper: css`
                margin-top: 32px;
            `,
        },
    },
    fromDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
};

const StyledDateRangeFieldSet = getStyledWrapper("fieldset");
const StyledOrderTotalFieldSet = getStyledWrapper("fieldset");

export const styles = savedOrderListFilterStyles;
const tzOffset = new Date().getTimezoneOffset() * 60000;
let updateTimeoutId: any;
const SavedOrderListFilter = ({ isFilterOpen, getCartsApiParameter, updateSearchFields, clearSearch }: Props) => {
    const [orderTotal, setOrderTotal] = React.useState("");
    const orderTotalChangeHandler = (total: string) => {
        setOrderTotal(total);
        if (typeof updateTimeoutId === "number") {
            clearTimeout(updateTimeoutId);
        }

        updateTimeoutId = setTimeout(() => {
            updateSearchFields({
                orderTotal: total,
            });
        }, 250);
    };

    const fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        updateSearchFields({
            fromDate: selectedDay ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0] : "",
        });
    };

    const toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        updateSearchFields({
            toDate: selectedDay ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0] : "",
        });
    };

    const orderTotalOperatorChangeHandler = (operator: string) => {
        updateSearchFields({ orderTotalOperator: operator });
    };

    const resetOrderTotal = () => {
        setOrderTotal("");
        updateSearchFields({ orderTotalOperator: "", orderTotal: "" });
    };

    const clearFiltersClickHandler = () => {
        clearSearch();
        setOrderTotal("");
    };

    if (!isFilterOpen) {
        return (
            <StyledWrapper {...styles.appliedFiltersContainer}>
                {getCartsApiParameter.fromDate && (
                    <Tag
                        {...styles.appliedFilterTag}
                        onDelete={() => {
                            fromDateChangeHandler({});
                        }}
                    >
                        {`${translate("From")}: ${getCartsApiParameter.fromDate}`}
                    </Tag>
                )}
                {getCartsApiParameter.toDate && (
                    <Tag
                        {...styles.appliedFilterTag}
                        onDelete={() => {
                            toDateChangeHandler({});
                        }}
                    >
                        {`${translate("To")}: ${getCartsApiParameter.toDate}`}
                    </Tag>
                )}
                {getCartsApiParameter.orderTotalOperator && getCartsApiParameter.orderTotal && (
                    <Tag
                        {...styles.appliedFilterTag}
                        onDelete={() => {
                            resetOrderTotal();
                        }}
                    >
                        {`${translate("Order Total")}: ${getCartsApiParameter.orderTotalOperator} ${
                            getCartsApiParameter.orderTotal
                        }`}
                    </Tag>
                )}
            </StyledWrapper>
        );
    }

    const fromDate = getCartsApiParameter.fromDate
        ? new Date(new Date(getCartsApiParameter.fromDate).getTime() + tzOffset)
        : undefined;
    const toDate = getCartsApiParameter.toDate
        ? new Date(new Date(getCartsApiParameter.toDate).getTime() + tzOffset)
        : undefined;

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.heading} as="h2">
                    {translate("Filter")}
                </Typography>
            </GridItem>
            <GridItem {...styles.orderTotalGridItem}>
                <StyledOrderTotalFieldSet {...styles.orderTotalFieldset}>
                    <VisuallyHidden as="label">{translate("Order Total")}</VisuallyHidden>
                    <GridContainer {...styles.orderTotalContainer}>
                        <GridItem {...styles.orderTotalOperatorGridItem}>
                            <Select
                                {...styles.orderTotalOperatorSelect}
                                label={translate("Order Total")}
                                value={getCartsApiParameter.orderTotalOperator || ""}
                                data-test-selector="savedOrderList_comparisonMethod"
                                onChange={event => orderTotalOperatorChangeHandler(event.target.value)}
                            >
                                <option value="">{translate("Select")}</option>
                                <option key="Greater Than" value="Greater Than">
                                    {translate("Greater Than")}
                                </option>
                                <option key="Less Than" value="Less Than">
                                    {translate("Less Than")}
                                </option>
                                <option key="Equal To" value="Equal To">
                                    {translate("Equal To")}
                                </option>
                            </Select>
                        </GridItem>
                        <GridItem {...styles.orderTotalAmountGridItem}>
                            <TextField
                                {...styles.orderTotalAmountTextField}
                                value={orderTotal}
                                data-test-selector="savedOrderList_comparisonValue"
                                onChange={event => orderTotalChangeHandler(event.target.value)}
                            />
                        </GridItem>
                    </GridContainer>
                </StyledOrderTotalFieldSet>
            </GridItem>
            <GridItem {...styles.datesGridItem}>
                <StyledDateRangeFieldSet {...styles.dateRangeFieldset}>
                    <VisuallyHidden as="label">{translate("Date Range")}</VisuallyHidden>
                    <GridContainer {...styles.datesContainer}>
                        <GridItem data-test-selector="savedOrderList_fromDateFilter" {...styles.fromGridItem}>
                            <DatePicker
                                {...styles.fromDate}
                                label={translate("From")}
                                selectedDay={fromDate}
                                onDayChange={fromDateChangeHandler}
                                dateTimePickerProps={{
                                    clearIcon: null,
                                    maxDate: toDate,
                                    ...styles.fromDate?.dateTimePickerProps,
                                }}
                            />
                        </GridItem>
                        <GridItem data-test-selector="savedOrderList_toDateFilter" {...styles.toGridItem}>
                            <DatePicker
                                {...styles.toDate}
                                label={translate("To")}
                                selectedDay={toDate}
                                onDayChange={toDateChangeHandler}
                                dateTimePickerProps={{
                                    clearIcon: null,
                                    minDate: fromDate,
                                    ...styles.toDate?.dateTimePickerProps,
                                }}
                            />
                        </GridItem>
                    </GridContainer>
                </StyledDateRangeFieldSet>
            </GridItem>
            <GridItem {...styles.buttonsItem}>
                <Button
                    {...styles.clearFiltersButton}
                    data-test-selector="savedOrderList_clearFiltersButton"
                    onClick={clearFiltersClickHandler}
                >
                    {translate("Clear Filters")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(SavedOrderListFilter),
    definition: {
        group: "Saved Order List",
        displayName: "Search Results Filter",
        allowedContexts: [SavedOrderListPageContext],
        isSystem: true,
    },
};

export default widgetModule;
