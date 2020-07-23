import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import translate from "@insite/client-framework/Translate";
import Breadcrumbs from "@insite/mobius/Breadcrumbs";
import { LinkProps } from "@insite/mobius/Link";
import React, { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    return {
        links: state.components.breadcrumbs.links,
        linksState: state.links,
        nodeId: getCurrentPage(state).nodeId,
    };
};

type Props = ReturnType<typeof mapStateToProps>;

const homePageLink = { children: translate("Home"), href: "/" };

const PageBreadcrumbs: FC<Props> = (props: Props) => {
    let links = props.links || generateLinksFrom(props.linksState, props.nodeId);
    if (links.length > 0 && links[0].href !== homePageLink.href) {
        links = [homePageLink, ...links];
    }

    return <Breadcrumbs links={links} data-test-selector="pageBreadcrumbs"/>;
};

export function generateLinksFrom(linksState: LinksState, nodeId: string) {
    const links: LinkProps[] = [];
    let currentLink = getPageLinkByNodeId({ links: linksState }, nodeId);
    while (currentLink) {
        if (currentLink.type === "HomePage") {
            links.unshift(homePageLink);
        } else {
            links.unshift({ children: currentLink.title, href: currentLink.url });
        }
        currentLink = currentLink.parentId ? getPageLinkByNodeId({ links: linksState }, currentLink.parentId) : undefined;
    }

    return links;
}

export default connect(mapStateToProps)(PageBreadcrumbs);
