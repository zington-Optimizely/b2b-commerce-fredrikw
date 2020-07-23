import { pageDefinitions } from "@insite/client-framework/Components/ContentItemStore";
import Scrim from "@insite/mobius/Overlay/Scrim";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import SideBarForm from "@insite/shell/Components/Shell/SideBarForm";
import { getPageDefinitions, LoadedPageDefinition } from "@insite/shell/DefinitionLoader";
import { addPage, cancelAddPage } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    addingPageUnderId: string;
    copyDisplayName: string;
    copyType: string;
    copyPageId: string;
}

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => {
    return {
        pageDefinitions: getPageDefinitions(),
    };
};

const mapDispatchToProps = {
    addPage,
    cancelAddPage,
};

const pageDefinitionsWithType = Object
    .keys(pageDefinitions)
    .map(key => {
        return { ...(pageDefinitions[key]), type: key };
    });

interface State {
    selectedPageType: string;
    pageName: string;
    pageTypeError: string;
    pageNameError: string;
    savingPage: boolean;
}

class AddPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedPageType: props.copyType,
            pageName: props.copyDisplayName,
            pageTypeError: "",
            pageNameError: "",
            savingPage: false,
        };
    }

    addPage = () => {
        const {
            selectedPageType,
            pageName,
        } = this.state;

        let pageTypeError = "";
        if (!selectedPageType) {
            pageTypeError = "Page Type is Required";
        }
        let pageNameError = "";
        if (!pageName) {
            pageNameError = "Display Name is Required";
        }

        if (pageTypeError || pageNameError) {
            this.setState({
                pageTypeError,
                pageNameError,
            });
            return;
        }

        this.setState({
            savingPage: true,
        });

        this.props.addPage(selectedPageType, pageName, this.props.addingPageUnderId, this.props.copyPageId, ({ duplicatesFound }) => {
            if (!duplicatesFound) {
                return;
            }

            this.setState({
                savingPage: false,
            });
        });
    };

    cancel = () => {
        this.props.cancelAddPage();
    };

    onPageTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.setState({
            selectedPageType: event.currentTarget.value,
            pageTypeError: "",
        });
    };

    onNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            pageName: event.currentTarget.value,
            pageNameError: "",
        });
    };

    render() {
        return <>
            <Scrim zIndexLevel="modal" />
            <SideBarForm title={this.props.copyPageId ? "Copy Page" : "Create A New Page"}
                         name={this.props.copyPageId ? "CopyPage" : "AddPage"} cancel={this.cancel}
                         save={this.addPage} saveText={this.props.copyPageId ? "Create Page" : "Continue"} disableSave={this.state.savingPage}>
                <TextField label="Display Name" name="DisplayName" value={this.state.pageName} onChange={this.onNameChange} error={this.state.pageNameError} />
                <Select disabled={!!this.props.copyPageId} label="Page Type" name="PageType" value={this.state.selectedPageType} onChange={this.onPageTypeChange} error={this.state.pageTypeError}>
                    <option value="">Select Type</option>
                    {pageDefinitionsWithType.filter(o => o.pageType === "Content").map((pageDefinition: LoadedPageDefinition) =>
                        <option key={pageDefinition.type} value={pageDefinition.type}>
                            {pageDefinition.type}
                        </option>,
                    )}
                </Select>
            </SideBarForm>
        </>;
    }
}

const ConnectedAddPage = connect(mapStateToProps, mapDispatchToProps)(AddPage);

interface WrapperProps {
    addingPageUnderId: string;
    copyDisplayName: string;
    copyType: string;
    copyPageId: string;
}

const mapWrapperState = (state: ShellState, ownProps: { }): WrapperProps => {
    return {
        addingPageUnderId: state.pageTree.addingPageUnderId || "",
        copyDisplayName: state.pageTree.copyPageDisplayName || "",
        copyType: state.pageTree.copyPageType || "",
        copyPageId: state.pageTree.copyPageId || "",
    };
};

// used so that it is easier to reset the state of the add page component.
const AddPageWrapper: React.FunctionComponent<WrapperProps> = (props: WrapperProps) => {
    if (!props.addingPageUnderId) {
        return null;
    }

    return <ConnectedAddPage addingPageUnderId={props.addingPageUnderId}
        copyDisplayName={props.copyDisplayName}
        copyType={props.copyType}
        copyPageId={props.copyPageId} />;
};

export default connect(mapWrapperState)(AddPageWrapper);
