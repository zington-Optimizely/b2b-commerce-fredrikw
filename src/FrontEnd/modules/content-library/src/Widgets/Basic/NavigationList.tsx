/* eslint-disable spire/export-styles */
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Link from "@insite/mobius/Link";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

const enum fields {
    depth = "depth",
    nodeId = "nodeId",
    leftMargin = "leftMargin",
    marginBottom = "marginBottom",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.depth]: number;
        [fields.nodeId]: LinkFieldValue;
        [fields.leftMargin]: number;
        [fields.marginBottom]: number;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    rootPageLink: getPageLinkByNodeId(state, ownProps.fields.nodeId?.value || getCurrentPage(state).nodeId),
});

const mapDispatchToProps = {};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class NavigationList extends React.Component<Props> {
    render() {
        if (!this.props.rootPageLink || !this.props.rootPageLink.children) {
            return null;
        }

        const ListStyle = styled.ul`
            margin-left: ${this.props.fields.leftMargin}px;
            li {
                margin-bottom: ${this.props.fields.marginBottom}px;
            }
        `;

        const renderLinks = (pageLinks: PageLinkModel[], currentDepth: number) => {
            if (currentDepth > this.props.fields.depth) {
                return;
            }

            const nextDepth = currentDepth + 1;

            return pageLinks
                .filter(pageLink => !pageLink.excludeFromNavigation)
                .map(pageLink => {
                    return (
                        <li key={pageLink.id}>
                            <Link data-test-selector={`navigationList-${pageLink.title}`} href={pageLink.url}>
                                {pageLink.title}
                            </Link>
                            {pageLink.children && pageLink.children.length > 0 && (
                                <ListStyle key={pageLink.id}>{renderLinks(pageLink.children, nextDepth)}</ListStyle>
                            )}
                        </li>
                    );
                });
        };

        return (
            <ListStyle data-test-selector="navigationList">
                {renderLinks(this.props.rootPageLink.children, 1)}
            </ListStyle>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(NavigationList),
    definition: {
        group: "Basic",
        icon: "NavigationList",
        fieldDefinitions: [
            {
                name: fields.depth,
                displayName: "Depth",
                editorTemplate: "IntegerField",
                defaultValue: 2,
                fieldType: "General",
            },
            {
                name: fields.nodeId,
                displayName: "Page",
                editorTemplate: "LinkField",
                defaultValue: {
                    value: "",
                    type: "Page",
                },
                fieldType: "General",
                allowUrls: item => false,
                allowCategories: item => false,
            },
            {
                name: fields.leftMargin,
                displayName: "Left Margin",
                editorTemplate: "IntegerField",
                defaultValue: 0,
                fieldType: "General",
                max: 100,
                min: 0,
            },
            {
                name: fields.marginBottom,
                displayName: "Margin Bottom",
                editorTemplate: "IntegerField",
                defaultValue: 0,
                fieldType: "General",
                max: 100,
                min: 0,
            },
        ],
    },
};

export default widgetModule;
