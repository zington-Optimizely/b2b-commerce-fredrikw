import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { LinkModel, mapLinks, getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import getColor from "@insite/mobius/utilities/getColor";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";

const enum fields { links = "links" }

interface OwnProps extends WidgetProps {
    fields: { [fields.links]: LinkModel[] };
    extendedStyles?: HeaderLinkListStyles;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const links = mapLinks<LinkModel, { openInNewWindow: boolean }>(state, ownProps.fields.links, (widgetLink) => ({
        openInNewWindow: widgetLink.fields.openInNewWindow,
    }));
    return {
        links,
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface HeaderLinkListStyles {
    headerLinkListWrapper?: InjectableCss;
    link?: LinkPresentationProps;
}

export const headerLinkListStyles: HeaderLinkListStyles = {
    headerLinkListWrapper: {
        css: css`
            text-align: right;
            padding: 0 0 23px 0;
            margin-right: -9px;
        `,
    },
    link: {
        typographyProps: {
            variant: "headerTertiary",
            css: css`
                margin: 0 9px 0 9px;
                display: inline-block;
                &&& { color: ${getColor("text.main")}; }
            `,
        },
    },
};

const HeaderLinkList: React.FC<Props> = ({
    links,
    extendedStyles,
}) => {
    if (links.length < 1) return null;

    const [styles] = React.useState(() => mergeToNew(headerLinkListStyles, extendedStyles));

    return <StyledWrapper {...styles.headerLinkListWrapper}>
        {links.map((link) =>
            link?.url
                && <Link
                    key={`${link.url}.${link.title}`}
                    href={link.url}
                    target={link.openInNewWindow ? "_blank" : ""}
                    {...styles.link}
                >
                    {link.title}
                </Link>,
        )}
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(HeaderLinkList),
    definition: {
        group: "Header",
        icon: "LinkList",
        isSystem: true,
        fieldDefinitions: [
            {
                name: fields.links,
                editorTemplate: "ListField",
                getDisplay: (item: HasFields, state) => {
                    const { type, value } = item.fields.destination;
                    if (type === "Page") {
                        const link = getPageLinkByNodeId(state, value);
                        return link?.title;
                    }
                    if (type === "Category") {
                        return value; // TODO ISC-10781 make this work
                    }
                    if (type === "Url") {
                        return value;
                    }
                    return value;
                },
                defaultValue: [],
                fieldType: "General",
                fieldDefinitions: [
                    {
                        name: "destination",
                        editorTemplate: "LinkField",
                        defaultValue: {
                            value: "",
                            type: "Page",
                        },
                        isRequired: true,
                    },
                    {
                        name: "openInNewWindow",
                        editorTemplate: "CheckboxField",
                        defaultValue: false,
                    },
                ],
            },
        ],
    },
};

export default widgetModule;
