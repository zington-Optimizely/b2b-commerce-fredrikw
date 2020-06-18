import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import translate from "@insite/client-framework/Translate";
import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Search from "@insite/mobius/Icons/Search";
import { connect, ResolveThunks } from "react-redux";
import { AddressesPageContext } from "@insite/content-library/Pages/AddressesPage";
import updateSearchFields from "@insite/client-framework/Store/Pages/Addresses/Handlers/UpdateSearchFields";

export interface AddressBookSearchBoxStyles {
    searchText?: TextFieldProps;
}

const styles: AddressBookSearchBoxStyles = {
    searchText: { iconProps: { src: Search } },
};

export const searchBoxStyles = styles;

interface OwnProps extends WidgetProps {
}

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

class AddressBookSearchBox extends React.Component<Props> {
    searchTimeoutId: number | undefined;
    readonly searchMinimumCharacterLength = 3;

    searchTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof this.searchTimeoutId === "number") {
            clearTimeout(this.searchTimeoutId);
        }
        const searchText = event.currentTarget.value;
        if (searchText.length > 0 && searchText.length < this.searchMinimumCharacterLength) {
            return;
        }
        this.searchTimeoutId = setTimeout(
            () => {
                this.props.updateSearchFields({
                    filter: searchText,
                    page: 1,
                });
            },
            250);
    };

    componentWillUnmount() {
        if (typeof this.searchTimeoutId === "number") {
            clearTimeout(this.searchTimeoutId);
        }
    }

    render() {
        return (
            <TextField
                placeholder={translate("Search Ship To")}
                {...styles.searchText}
                onChange={this.searchTextChangeHandler} />
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(AddressBookSearchBox),
    definition: {
        group: "Addresses",
        allowedContexts: [AddressesPageContext],
        isSystem: true,
    },
};

export default widgetModule;
