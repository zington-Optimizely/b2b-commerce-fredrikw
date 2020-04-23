import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import { css } from "styled-components";

const mapStateToProps = ({ pages: { signIn: { isSigningInAsGuest } } }: ApplicationState) => ({
    // This means the loading overlay shows until the browser redirects
    showLoadingOverlay: isSigningInAsGuest,
});

type Props = PageProps & ReturnType<typeof mapStateToProps>;

const SignInPage = ({
    id,
    showLoadingOverlay,
}: Props) => (
    <LoadingOverlay loading={showLoadingOverlay} css={css` width: 100%; `}>
        <Page data-test-selector="signIn">
            <Zone contentId={id} zoneName="Content"/>
        </Page>
    </LoadingOverlay>
);

const pageModule: PageModule = {
    component: connect(mapStateToProps)(SignInPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const SignInPageContext = "SignInPage";
