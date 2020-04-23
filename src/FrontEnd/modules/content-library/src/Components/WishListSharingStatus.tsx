import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { css } from "styled-components";
import React, { FC } from "react";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import HelpCircle from "@insite/mobius/Icons/HelpCircle";
import Users from "@insite/mobius/Icons/Users";
import translate from "@insite/client-framework/Translate";

export interface WishListSharingStatusStyles {
    statusText?: TypographyProps;
    privateIcon?: IconPresentationProps;
    sharedIcon?: IconPresentationProps;
}

export const wishListSharingStatusStyles : WishListSharingStatusStyles = {
    privateIcon: {
        src: HelpCircle,
        size: 15,
        css: css` margin-left: 5px; `,
    },
    sharedIcon: {
        src: Users,
        size: 15,
        css: css` margin-right: 5px; `,
    },
};

interface OwnProps {
    extendedStyles?: WishListSharingStatusStyles;
    isSharedList: boolean;
    wishListSharesCount: number;
    sharedByDisplayName?: string;
}

export const WishListSharingStatus: FC<OwnProps> = (props: OwnProps) => {
    const { extendedStyles, isSharedList, wishListSharesCount, sharedByDisplayName } = props;

    const [styles] = React.useState(() => mergeToNew(wishListSharingStatusStyles, extendedStyles));

    return (
        <>
            {!isSharedList && wishListSharesCount === 0
                && <Typography {...styles.statusText}>
                    {translate("Private")}
                    <Icon {...styles.privateIcon} />
                </Typography>}
            {!isSharedList && wishListSharesCount > 0
                && <Typography {...styles.statusText}>
                    <Icon {...styles.sharedIcon} />
                    {translate("Shared with")} {wishListSharesCount} {translate("others")}
                </Typography>}
            {isSharedList
                && <Typography {...styles.statusText}>
                    <Icon {...styles.sharedIcon} />
                    {translate("Shared by")} {sharedByDisplayName}
                </Typography>}
        </>
    );
};

export default WishListSharingStatus;
