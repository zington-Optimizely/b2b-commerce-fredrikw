import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import {
    ShipToModel,
    BillToModel,
    BaseAddressModel,
    CountryModel,
    AddressFieldDisplayCollectionModel,
} from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import CustomerAddressForm from "@insite/content-library/Components/CustomerAddressForm";
import translate from "@insite/client-framework/Translate";
import loadShipTos from "@insite/client-framework/Store/Pages/Addresses/Handlers/LoadShipTos";
import siteMessage from "@insite/client-framework/SiteMessage";
import Hidden from "@insite/mobius/Hidden";
import { IconPresentationProps } from "@insite/mobius/Icon";
import getColor from "@insite/mobius/utilities/getColor";
import setCurrentShipTo from "@insite/client-framework/Store/Context/Handlers/SetCurrentShipTo";
import Zone from "@insite/client-framework/Components/Zone";
import { AddressesPageContext } from "@insite/content-library/Pages/AddressesPage";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Clickable from "@insite/mobius/Clickable";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import updateShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/UpdateShipTo";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { createContext, useContext, useState } from "react";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    shipTosDataView: getShipTosDataView(state, state.pages.addresses.getShipTosParameter),
    getShipTosParameter: state.pages.addresses.getShipTosParameter,
    currentBillTo: getCurrentBillToState(state).value,
    countries: getCurrentCountries(state),
    addressFieldDataView: getAddressFieldsDataView(state),
});

const mapDispatchToProps = {
    setCurrentShipTo,
    loadShipTos,
    updateShipTo,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AddressBookStyles {
    gridContainer?: GridContainerProps;
    titleTextGridItem?: GridItemProps;
    addressHeaderGridItem?: GridItemProps;
    titleText?: TypographyProps;
    noAddressesText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    addressCardGridItem?: GridItemProps;
    addressFormModal?: ModalPresentationProps;
    addressCard?: AddressCardStyles;
}

interface AddressCardStyles {
    gridContainer?: GridContainerProps;
    addressInfoDisplayGridItem?: GridItemProps;
    addressInfoDisplay?: AddressInfoDisplayStyles;
    actionsGridItem?: GridItemProps;
    actionOverflowIcon?: IconPresentationProps;
    actionUseAsShippingAddressButton?: ButtonPresentationProps;
    actionEditLink?: LinkPresentationProps;
    bottomBorderGridItem?: GridItemProps;
    bottomBorder?: InjectableCss;
    overflowMenu?: OverflowMenuPresentationProps;
}

const styles: AddressBookStyles = {
    gridContainer: { gap: 20 },
    titleTextGridItem: { width: 12 },
    addressHeaderGridItem: { width: 12 },
    titleText: { variant: "h5" },
    noAddressesText: {
        variant: "h4",
        css: css`
            display: block;
            margin: auto;
        `,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            width: 100%;
            display: flex;
            align-items: center;
        `,
    },
    spinner: { css: css` margin: auto; ` },
    addressCardGridItem: { width: 12 },
    addressCard: {
        gridContainer: { gap: 20 },
        addressInfoDisplayGridItem: { width: [10, 10, 5, 7, 7] },
        actionsGridItem: {
            width: [2, 2, 7, 5, 5],
            css: css` justify-content: flex-end; `,
        },
        actionUseAsShippingAddressButton: { color: "secondary" },
        actionEditLink: {
            css: css`
                display: block;
                margin: 20px auto 0 auto;
            `,
        },
        bottomBorderGridItem: { width: 12 },
        bottomBorder: {
            css: css`
                height: 1px;
                background-color: ${getColor("common.border")};
                width: 100%;
            `,
        },
        overflowMenu: {
            cssOverrides: {
                menu: css` width: 210px; `,
            },
        },
    },
    addressFormModal: { sizeVariant: "medium" },
};

export const addressBookStyles = styles;

type ContextType = {
    isSettingShipTo: boolean;
    setIsSettingShipTo: (value: boolean) => void;
};

export const AddressBookContext = createContext<ContextType>({
    isSettingShipTo: false, setIsSettingShipTo: value => {
    },
});

const AddressBook: React.FC<Props> = (props) => {
    const { shipTosDataView } = props;

    const [isSettingShipTo, setIsSettingShipTo] = useState(false);

    React.useEffect(() => {
        if (!shipTosDataView.value && !shipTosDataView.isLoading) {
            props.loadShipTos();
        }
    });

    let component;
    if (shipTosDataView.isLoading || !shipTosDataView.value || !props.addressFieldDataView.value) {
        component = (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    } else if (shipTosDataView.value.length > 0) {
        component = shipTosDataView.value.map(shipTo => (
            <GridItem {...styles.addressCardGridItem} key={shipTo.id.toString()}>
                <AddressCard
                    shipTo={shipTo}
                    setCurrentShipTo={props.setCurrentShipTo}
                    updateShipTo={props.updateShipTo}
                    billToAddressFields={props.addressFieldDataView.value!.billToAddressFields}
                    shipToAddressFields={props.addressFieldDataView.value!.shipToAddressFields}
                    countries={props.countries}
                    currentBillTo={props.currentBillTo}
                />
            </GridItem>
        ));
    } else {
        component = (
            <StyledWrapper {...styles.centeringWrapper}>
                <Typography {...styles.noAddressesText}>
                    {props.getShipTosParameter.filter ? siteMessage("Addresses_NoResultsMessage") : siteMessage("Addresses_NoAddressesFound")}
                </Typography>
            </StyledWrapper>
        );
    }

    return <AddressBookContext.Provider value={{ isSettingShipTo, setIsSettingShipTo }}>
        <GridContainer {...styles.gridContainer}>
            <GridItem {...styles.titleTextGridItem}>
                <Typography {...styles.titleText}>{translate("Address Book")}</Typography>
            </GridItem>
            <GridItem {...styles.addressHeaderGridItem}>
                <Zone contentId={props.id} zoneName="Content00"/>
            </GridItem>
            {component}
        </GridContainer>
    </AddressBookContext.Provider>;
};

interface AddressCardProps {
    shipTo: ShipToModel;
    currentBillTo?: BillToModel;
    countries?: CountryModel[];
    billToAddressFields?: AddressFieldDisplayCollectionModel;
    shipToAddressFields?: AddressFieldDisplayCollectionModel;
    setCurrentShipTo: Props["setCurrentShipTo"];
    updateShipTo: Props["updateShipTo"];
}

const AddressCard: React.FunctionComponent<AddressCardProps> = (props: AddressCardProps) => {
    const { shipTo } = props;
    const componentStyles: AddressCardStyles = styles.addressCard || {};

    return (
        <GridContainer {...componentStyles.gridContainer}>
            <GridItem {...componentStyles.addressInfoDisplayGridItem}>
                <AddressInfoDisplay
                    firstName={shipTo.firstName}
                    lastName={shipTo.lastName}
                    companyName={shipTo.companyName}
                    attention={shipTo.attention}
                    address1={shipTo.address1}
                    address2={shipTo.address2}
                    address3={shipTo.address3}
                    address4={shipTo.address4}
                    city={shipTo.city}
                    state={shipTo.state ? shipTo.state.abbreviation : undefined}
                    postalCode={shipTo.postalCode}
                    country={shipTo.country ? shipTo.country.abbreviation : undefined}
                    phone={shipTo.phone}
                    fax={shipTo.fax}
                    email={shipTo.email}
                    extendedStyles={componentStyles.addressInfoDisplay}/>
            </GridItem>
            <GridItem {...componentStyles.actionsGridItem}>
                <AddressActions
                    shipTo={shipTo}
                    updateShipTo={props.updateShipTo}
                    setCurrentShipTo={props.setCurrentShipTo}
                    currentBillTo={props.currentBillTo}
                    countries={props.countries}
                    shipToAddressFields={props.shipToAddressFields}
                    billToAddressFields={props.billToAddressFields}
                />
            </GridItem>
            <GridItem {...componentStyles.bottomBorderGridItem}>
                <StyledWrapper {...componentStyles.bottomBorder} />
            </GridItem>
        </GridContainer>
    );
};

interface AddressActionsProps {
    shipTo: ShipToModel;
    currentBillTo?: BillToModel;
    countries?: CountryModel[];
    billToAddressFields?: AddressFieldDisplayCollectionModel;
    shipToAddressFields?: AddressFieldDisplayCollectionModel;
    setCurrentShipTo: Props["setCurrentShipTo"];
    updateShipTo: Props["updateShipTo"];
}

const AddressActions: React.FunctionComponent<AddressActionsProps> = (props: AddressActionsProps) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);

    const { shipTo } = props;

    const addressBookContext = useContext(AddressBookContext);

    const useAsShippingAddressHandler = (e: any) => {
        e.preventDefault();
        addressBookContext.setIsSettingShipTo(true);
        props.setCurrentShipTo({ shipToId: shipTo.id, onSuccess: () => {
            addressBookContext.setIsSettingShipTo(false);
            } });
    };

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };

    const editClickHandler = () => {
        setModalIsOpen(true);
    };

    const formCancelHandler = (e: any) => {
        e.preventDefault();
        modalCloseHandler();
    };

    const formSubmitHandler = (e: any, address: BaseAddressModel) => {
        e.preventDefault();
        const { currentBillTo, shipTo } = props;
        if (!currentBillTo || !shipTo) {
            return;
        }

        props.updateShipTo({
            billToId: currentBillTo.id,
            shipTo: {
                ...shipTo,
                ...address,
            },
        });
        modalCloseHandler();
    };

    const { countries, shipToAddressFields } = props;
    const componentStyles: AddressCardStyles = styles.addressCard || {};

    return (
        <>
            <Hidden above="sm">
                <OverflowMenu {...componentStyles.overflowMenu}>
                    <Clickable onClick={useAsShippingAddressHandler} disabled={addressBookContext.isSettingShipTo}>{translate("Use as Shipping Address")}</Clickable>
                    <Clickable onClick={editClickHandler}>{translate("Edit")}</Clickable>
                </OverflowMenu>
            </Hidden>
            <Hidden below="md">
                <Button
                    {...componentStyles.actionUseAsShippingAddressButton}
                    onClick={useAsShippingAddressHandler}
                    disabled={addressBookContext.isSettingShipTo}
                >
                    {translate("Use as Shipping Address")}
                </Button>
                <Link
                    {...componentStyles.actionEditLink}
                    onClick={editClickHandler}
                >
                    {translate("Edit")}
                </Link>
            </Hidden>
            <Modal
                {...styles.addressFormModal}
                isOpen={modalIsOpen}
                handleClose={modalCloseHandler}
                headline={translate("Edit Shipping Information")}
            >
                {countries && shipToAddressFields
                && <CustomerAddressForm
                    address={shipTo}
                    countries={countries}
                    addressFieldDisplayCollection={shipToAddressFields}
                    onCancel={formCancelHandler}
                    onSubmit={formSubmitHandler}/>
                }
            </Modal>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AddressBook),
    definition: {
        fieldDefinitions: [],
        group: "Addresses",
        allowedContexts: [AddressesPageContext],
    },
};

export default widgetModule;
