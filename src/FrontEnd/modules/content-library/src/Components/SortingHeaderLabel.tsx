import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import ChevronDown from "@insite/mobius/Icons/ChevronDown";
import ChevronUp from "@insite/mobius/Icons/ChevronUp";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import * as React from "react";
import { css } from "styled-components";

interface OwnProps {
    label: string;
    sortField: string;
    sortParameter?: string;
    onHeaderClick: (sortField: string) => void;
    extendedStyles?: SortingHeaderLabelStyles;
}

type Props = OwnProps;

export interface SortingHeaderLabelStyles {
    headerClickables?: ClickableProps;
    headerText?: TypographyPresentationProps;
    chevronUpIcon?: IconPresentationProps;
    chevronDownIcon?: IconPresentationProps;
}

export const sortingHeaderLabelStyles: SortingHeaderLabelStyles = {
    headerClickables: {
        css: css`
            width: 100%;
            justify-content: space-between;
        `,
    },
    chevronUpIcon: {
        size: 14,
    },
    chevronDownIcon: {
        size: 14,
    },
};

const styles = sortingHeaderLabelStyles;

const SortingHeaderLabel: React.FC<Props> = ({ label, sortField, sortParameter, onHeaderClick, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(sortingHeaderLabelStyles, extendedStyles));

    return (
        // TODO ISC-12604 screenreader content for what the click action does
        <Clickable {...styles.headerClickables} onClick={() => onHeaderClick(sortField)}>
            <Typography {...styles.headerText}>{label}</Typography>
            {sortParameter === sortField ? (
                <Icon src={ChevronUp} {...styles.chevronUpIcon} />
            ) : sortParameter === `${sortField} DESC` ? (
                <Icon src={ChevronDown} {...styles.chevronDownIcon} />
            ) : null}
        </Clickable>
    );
};

export default SortingHeaderLabel;
