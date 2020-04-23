import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import FieldDefinition from "@insite/client-framework/Types/FieldDefinition";
import { getPageDefinition, getWidgetDefinition, LoadedPageDefinition, LoadedWidgetDefinition } from "@insite/shell/DefinitionLoader";
import ShellState from "@insite/shell/Store/ShellState";
import PageProps, { ItemProps } from "@insite/client-framework/Types/PageProps";
import Scrim from "@insite/mobius/Overlay/Scrim";
import styled from "styled-components";
import { doneEditingItem, cancelEditingItem } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { updateField, replaceItem, removeWidget } from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageActionCreators";
import SideBarForm from "@insite/shell/Components/Shell/SideBarForm";
import FieldsEditor from "@insite/shell/Components/ItemEditor/FieldsEditor";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";

interface OwnProps {}

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => {
    let item: PageProps | WidgetProps | undefined;
    let definition: LoadedPageDefinition | LoadedWidgetDefinition | undefined;
    if (state.pageEditor.editingId) {
        if (state.pageEditor.editingId === state.currentPage.page.id) {
            item = state.currentPage.page;
            definition = getPageDefinition(item.type);
        } else {
            item = state.currentPage.widgetsById[state.pageEditor.editingId];
            definition = getWidgetDefinition(item.type);
        }
    }

    return {
        item,
        definition,
        itemBeforeEditing: state.pageEditor.itemBeforeEditing,
        language: state.shellContext.languagesById[state.shellContext.currentLanguageId]!,
        defaultLanguageId: state.shellContext.defaultLanguageId,
        personaId: state.shellContext.currentPersonaId,
        defaultPersonaId: state.shellContext.defaultPersonaId,
        deviceType: state.shellContext.currentDeviceType,
        removeItemIfCanceled: state.pageEditor.removeItemIfCanceled,
    };
};

const mapDispatchToProps = {
    updateField,
    doneEditingItem,
    cancelEditingItem,
    replaceItem,
    removeWidget,
};

type Props =
    ReturnType<typeof mapStateToProps>
    & ResolveThunks<typeof mapDispatchToProps>
    & OwnProps;

interface State {
    hasValidationErrors: boolean;
}

class ItemEditor extends React.Component<Props, State> {
    private hasValidationErrors: () => boolean;

    constructor(props: Props) {
        super(props);

        this.hasValidationErrors = () => false;
        this.state = {
            hasValidationErrors: false,
        };
    }

    updateField = (fieldName: string, value: any) => {
        const { item, definition, language, defaultLanguageId, personaId, defaultPersonaId, deviceType } = this.props;
        if (!item || !definition) {
            return;
        }

        const fieldDefinition = definition.fieldDefinitions.filter(o => o.name === fieldName)[0];

        const parameter = {
            id: item.id,
            fieldName,
            value,
            fieldType: fieldDefinition.fieldType,
            language,
            defaultLanguageId,
            personaId,
            defaultPersonaId,
            deviceType,
        };
        sendToSite({
            type: "UpdateField",
            ...parameter,
        });
        this.props.updateField(parameter);
    };

    doneEditingItem = () => {
        if (!this.hasValidationErrors()) {
            this.props.doneEditingItem();
        }
    };

    cancelEditingItem = () => {
        const { itemBeforeEditing, cancelEditingItem, removeItemIfCanceled, removeWidget, replaceItem } = this.props;
        cancelEditingItem();
        if (removeItemIfCanceled) {
            removeWidget(itemBeforeEditing!.id);
            sendToSite({
                type: "RemoveWidget",
                id: itemBeforeEditing!.id,
            });
        } else {
            replaceItem(itemBeforeEditing!);
            sendToSite({
                type: "ReplaceItem",
                item: itemBeforeEditing!,
            });
        }
    };

    updateHasValidationErrors = (hasValidationErrors: boolean) => {
        this.setState({
            hasValidationErrors,
        });
    };

    registerHasValidationErrors = (validate: () => boolean) => {
        this.hasValidationErrors = validate;
    };

    render() {
        const { item, definition } = this.props;

        if (!item || !definition) {
            return null;
        }

        return (
            <>
                <Scrim zIndexLevel="modal" />
                <SideBarForm title={`Edit ${definition.displayName}`} save={this.doneEditingItem} name="EditItem"
                             cancel={this.cancelEditingItem}
                             disableSave={this.state.hasValidationErrors}>
                    <FieldsEditor fieldDefinitions={definition.fieldDefinitions}
                                  item={item}
                                  updateField={this.updateField}
                                  registerHasValidationErrors={this.registerHasValidationErrors}
                                  updateHasValidationErrors={this.updateHasValidationErrors} />
                </SideBarForm>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor);

export interface ContentItemFieldProps<TFieldValue, TFieldDefinition extends FieldDefinition> {
    fieldDefinition: TFieldDefinition;
    item: ItemProps;
    fieldValue: TFieldValue;
    updateField: (fieldName: string, value: TFieldValue) => void;
}

type ContentItemFieldComponent = React.ComponentType<ContentItemFieldProps<any, FieldDefinition>>;

const ErrorMessage = styled.span`
    color: red;
`;

const TabsStyle = styled.ul`
    border: 1px solid #ccc;
    display: flex;
    border-radius: 3px;
    height: 35px;
    align-items: center;

    li {
        background: linear-gradient(180deg, #fff 0%, #eaeaea 100%);
        flex-grow: 1;
        text-align: center;
        border-left: 1px solid #ccc;
        font-size: 18px;
        line-height: 21px;
        font-weight: 300;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    li:first-child {
        border-left: none;
    }
`;
