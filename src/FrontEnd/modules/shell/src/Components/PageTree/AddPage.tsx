import { pageDefinitions } from "@insite/client-framework/Components/ContentItemStore";
import { TemplateInfo } from "@insite/client-framework/Types/SiteGenerationModel";
import Checkbox from "@insite/mobius/Checkbox";
import Scrim from "@insite/mobius/Overlay/Scrim";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import SideBarForm from "@insite/shell/Components/Shell/SideBarForm";
import { getPageDefinitions } from "@insite/shell/DefinitionLoader";
import { LoadedPageDefinition } from "@insite/shell/DefinitionTypes";
import { getPageState } from "@insite/shell/Services/ContentAdminService";
import { getTemplatePaths } from "@insite/shell/Services/SpireService";
import { addPage, cancelAddPage } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    addingPageUnderId: string;
    copyDisplayName: string;
    copyType: string;
    copyPageId: string;
    variantType: string;
    variantPageName: string;
    variantPageId: string;
}

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => {
    const {
        pageTree: { treeNodesByParentId, headerTreeNodesByParentId, footerTreeNodesByParentId },
    } = state;

    return {
        pageDefinitions: getPageDefinitions(),
        treeNodesByParentId,
        headerTreeNodesByParentId,
        footerTreeNodesByParentId,
    };
};

const mapDispatchToProps = {
    addPage,
    cancelAddPage,
};

const pageDefinitionsWithType = Object.keys(pageDefinitions).map(key => {
    return { ...pageDefinitions[key], type: key };
});

interface State {
    selectedPageType: string;
    pageName: string;
    variantName: string;
    pageTypeError: string;
    pageNameError: string;
    savingPage: boolean;
    templates: TemplateInfo[];
    selectedPageTemplate: string;
    pageTemplateError: string;
    variantNameError: string;
    copyVariantContent: boolean;
}

class AddPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedPageType: props.copyType || props.variantType,
            pageName: props.copyDisplayName || props.variantPageName,
            variantName: "",
            pageTypeError: "",
            pageNameError: "",
            variantNameError: "",
            savingPage: false,
            templates: [],
            selectedPageTemplate: "",
            pageTemplateError: "",
            copyVariantContent: false,
        };
    }

    addPage = () => {
        const { selectedPageType, selectedPageTemplate, pageName, variantName, copyVariantContent } = this.state;

        const isVariant = !!this.props.variantPageId;

        let pageTypeError = "";
        if (!selectedPageType) {
            pageTypeError = "Page Type is Required";
        }
        let pageNameError = "";
        if (!pageName) {
            pageNameError = "Display Name is Required";
        }
        let pageTemplateError = "";
        if (!selectedPageTemplate && this.state.templates.length > 1) {
            pageTemplateError = "Page Template is Required";
        }
        let variantNameError = "";
        if (isVariant && !variantName) {
            variantNameError = "Variant Name is Required";
        }

        if (pageTypeError || pageNameError || pageTemplateError || variantNameError) {
            this.setState({
                pageTypeError,
                pageNameError,
                pageTemplateError,
                variantNameError,
            });
            return;
        }

        this.setState({
            savingPage: true,
        });

        let variantPageId = this.props.variantPageId;

        if (isVariant) {
            const parentId = this.props.addingPageUnderId;
            const rootPageState = getPageState(
                variantPageId,
                this.props.treeNodesByParentId[parentId],
                this.props.headerTreeNodesByParentId[parentId],
                this.props.footerTreeNodesByParentId[parentId],
            );

            if (rootPageState?.isRootVariant) {
                const childList =
                    this.props.treeNodesByParentId[rootPageState.nodeId] ||
                    this.props.headerTreeNodesByParentId[rootPageState.nodeId] ||
                    this.props.footerTreeNodesByParentId[rootPageState.nodeId];

                for (const child of childList) {
                    if (!child.isVariant || !child.isDefaultVariant) {
                        continue;
                    }
                    variantPageId = child.pageId;
                    break;
                }
            }
        }

        this.props.addPage({
            pageType: selectedPageType,
            pageName: isVariant ? variantName : pageName,
            parentId: this.props.addingPageUnderId,
            copyPageId: this.props.copyPageId || variantPageId,
            pageTemplate: this.state.selectedPageTemplate,
            isVariant,
            copyVariantContent,
            afterSavePage: ({ duplicatesFound }) => {
                if (!duplicatesFound) {
                    return;
                }

                this.setState({
                    savingPage: false,
                });
            },
        });
    };

    cancel = () => {
        this.props.cancelAddPage();
    };

    onPageTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const pageType = event.currentTarget.value;
        getTemplatePaths(pageType).then(templates => {
            this.setState({
                selectedPageType: pageType,
                pageTypeError: "",
                templates,
                selectedPageTemplate: templates.length === 1 ? templates[0].fullPath : "",
                pageTemplateError: "",
            });
        });
    };

    onPageTemplateChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.setState({
            selectedPageTemplate: event.currentTarget.value,
        });
    };

    onNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            pageName: event.currentTarget.value,
            pageNameError: "",
        });
    };

    onVariantNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            variantName: event.currentTarget.value,
            variantNameError: "",
        });
    };

    onCopyVariantContent = (_: React.SyntheticEvent<Element, Event>, value: boolean) => {
        this.setState({
            copyVariantContent: value,
        });
    };

    render() {
        let title = "Create A New Page";
        let name = "AddPage";
        let saveText = "Continue";

        if (this.props.copyPageId) {
            title = "Copy Page";
            name = "CopyPage";
            saveText = "Create Page";
        } else if (this.props.variantPageId) {
            title = "Create Variant";
            name = "CreateVariant";
            saveText = "Save";
        }

        return (
            <>
                <Scrim zIndexLevel="modal" />
                <SideBarForm
                    title={title}
                    name={name}
                    cancel={this.cancel}
                    save={this.addPage}
                    saveText={saveText}
                    disableSave={this.state.savingPage}
                >
                    <TextField
                        disabled={!!this.props.variantPageId}
                        label="Display Name"
                        name="DisplayName"
                        value={this.state.pageName}
                        onChange={this.onNameChange}
                        error={this.state.pageNameError}
                    />
                    {this.props.variantPageId && (
                        <TextField
                            label="Variant Name"
                            name="VariantName"
                            value={this.state.variantName}
                            onChange={this.onVariantNameChange}
                            error={this.state.variantNameError}
                        />
                    )}
                    {this.props.variantPageId && (
                        <CopyVariantContentCheckbox
                            data-test-selector="createVariant_CopyVariantContent"
                            onChange={this.onCopyVariantContent}
                            checked={this.state.copyVariantContent}
                        >
                            Copy Content from Default
                        </CopyVariantContentCheckbox>
                    )}
                    <Select
                        disabled={!!this.props.copyPageId || !!this.props.variantPageId}
                        label="Page Type"
                        name="PageType"
                        value={this.state.selectedPageType}
                        onChange={this.onPageTypeChange}
                        error={this.state.pageTypeError}
                    >
                        <option value="">Select Type</option>
                        {pageDefinitionsWithType
                            .filter(o => o.pageType === "Content")
                            .map((pageDefinition: LoadedPageDefinition) => (
                                <option key={pageDefinition.type} value={pageDefinition.type}>
                                    {pageDefinition.type}
                                </option>
                            ))}
                    </Select>
                    {this.state.selectedPageType && this.state.templates.length > 1 && (
                        <Select
                            label="Page Template"
                            name="PageTemplate"
                            value={this.state.selectedPageTemplate}
                            onChange={this.onPageTemplateChange}
                            error={this.state.pageTemplateError}
                        >
                            <option value="">Select Template</option>
                            {this.state.templates.map(template => (
                                <option key={template.fullPath} value={template.fullPath}>
                                    {template.name}
                                </option>
                            ))}
                        </Select>
                    )}
                </SideBarForm>
            </>
        );
    }
}

const ConnectedAddPage = connect(mapStateToProps, mapDispatchToProps)(AddPage);

interface WrapperProps {
    addingPageUnderId: string;
    copyDisplayName: string;
    copyType: string;
    copyPageId: string;
    variantType: string;
    variantPageName: string;
    variantPageId: string;
}

const mapWrapperState = (state: ShellState, ownProps: {}): WrapperProps => {
    return {
        addingPageUnderId: state.pageTree.addingPageUnderId || "",
        copyDisplayName: state.pageTree.copyPageDisplayName || "",
        copyType: state.pageTree.copyPageType || "",
        copyPageId: state.pageTree.copyPageId || "",
        variantType: state.pageTree.variantPageType || "",
        variantPageName: state.pageTree.variantPageName || "",
        variantPageId: state.pageTree.variantPageId || "",
    };
};

// used so that it is easier to reset the state of the add page component.
const AddPageWrapper: React.FunctionComponent<WrapperProps> = (props: WrapperProps) => {
    if (!props.addingPageUnderId) {
        return null;
    }

    return (
        <ConnectedAddPage
            addingPageUnderId={props.addingPageUnderId}
            copyDisplayName={props.copyDisplayName}
            copyType={props.copyType}
            copyPageId={props.copyPageId}
            variantType={props.variantType}
            variantPageName={props.variantPageName}
            variantPageId={props.variantPageId}
        />
    );
};

export default connect(mapWrapperState)(AddPageWrapper);

const CopyVariantContentCheckbox = styled(Checkbox)`
    margin-top: 10px;
`;
