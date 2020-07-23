import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import SkipNav, { SkipNavStyles } from "@insite/content-library/Components/SkipNav";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Page from "@insite/mobius/Page";
import Typography from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    siteName: state.context.website.name,
});

interface OwnProps extends PageProps {}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface HeaderStyles {
    container?: InjectableCss;
    skipToContent?: SkipNavStyles;
    websiteName?: InjectableCss;
}

const styles: HeaderStyles = {
    container: {
        css: css`
            background-color: ${getColor("secondary.main")};
            display: flex;
            > div:first-child {
                flex-grow: 1;
            }
            > div:last-child {
                max-width: 150px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: auto;
                ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [null, null, css` max-width: 50px; `], "max")}
            }
        `,
    },
    websiteName: {
        css: css`
            @media print { display: block; }
            font-size: 12px;
            padding-left: 15px;
            display: none;
        `,
    },
};

export const headerStyles = styles;

const Header: React.FC<Props> = ({ id, siteName }) => {
    const afterHeader = React.createRef<HTMLSpanElement>();
    return <>
        {siteName && <Typography {...styles.websiteName}>{siteName}</Typography>}
        <Page as="header" fullWidth={[true, true, false, false, false]}>
            <SkipNav extendedStyles={styles.skipToContent} text={translate("Skip to main content")} destination={afterHeader} />
            <Zone contentId={id} zoneName="SecondaryNavigation" fixed />
            <StyledWrapper {...styles.container}>
                <Zone contentId={id} zoneName="MainNavigation" fixed />
                <Zone contentId={id} zoneName="Cart" fixed />
            </StyledWrapper>
            <Zone contentId={id} zoneName="Breadcrumb" />
            <span ref={afterHeader} tabIndex={-1}/>
      </Page>
  </>;
};

const pageModule: PageModule = {
    component: connect(mapStateToProps)(Header),
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export const HeaderContext = "HeaderContext";

export default pageModule;
