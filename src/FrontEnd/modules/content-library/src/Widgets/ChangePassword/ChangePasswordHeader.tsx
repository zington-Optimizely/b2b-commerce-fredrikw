import React, { FC } from "react";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import ChangePasswordActions from "@insite/content-library/Widgets/ChangePassword/ChangePasswordActions";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import { css } from "styled-components";

interface OwnProps {
    title: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
    error: boolean;
    showValidation: boolean;
    setShowValidation: (showValidation: boolean) => void;
}

type Props = OwnProps;

export interface ChangePasswordHeaderStyles {
    headerGridContainer?: GridContainerProps;
    title?: TypographyProps;
    titleGridItem?: GridItemProps;
    buttonGridItem?: GridItemProps;
    actions?: HiddenProps;
}

const styles: ChangePasswordHeaderStyles = {
    headerGridContainer: {
        gap: 0,
    },
    buttonGridItem: {
        css: css` justify-content: flex-end; `,
        width: [12, 12, 4, 3, 3],
    },
    titleGridItem: {
        width: [12, 12, 8, 9, 9],
    },
    title: {
        variant: "h2",
        as: "h1",
    },
    actions: {
        css: css` width: 100%; `,
    },
};

export const changePasswordHeaderStyles = styles;

const ChangePasswordHeader: FC<Props> = props => {
    const title = props.title || translate("Change Password");

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title}>{title}</Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.actions} below="md">
                    <ChangePasswordActions
                        confirmNewPassword={props.confirmNewPassword}
                        error={props.error}
                        newPassword={props.newPassword}
                        password={props.password}
                        setShowValidation={props.setShowValidation}
                        showValidation={props.showValidation}
                    />
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

export default ChangePasswordHeader;
