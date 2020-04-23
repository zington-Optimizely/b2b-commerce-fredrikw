import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC, useState } from "react";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import translate from "@insite/client-framework/Translate";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";

interface OwnProps {
    cart: Cart;
    /**
     * If true, the notes will display in a text field for editing.
     * If false, the notes will display as read-only text.
     * Default value: false
     */
    editable?: boolean;
    onNotesChange?: (updatedNotes: string) => void;
    label?: string;
    extendedStyles?: CartLineNotesStyles;
}

type Props = OwnProps & HasCartLineContext;

export interface CartLineNotesStyles {
    wrapper?: InjectableCss;
    toggleLink?: LinkPresentationProps;
    editableNotesTextArea?: TextAreaProps;
    readOnlyNotesText?: SmallHeadingAndTextStyles;
}

export const cartLineNotesStyles: CartLineNotesStyles = {
    wrapper: {
        css: css` width: 100%; `,
    },
    toggleLink: {
        css: css` margin-bottom: 10px; `,
    },
};


const CartLineNotes: FC<Props> = ({
    cart,
    cartLine,
    editable = false,
    onNotesChange = () => { },
    label,
    extendedStyles,
}) => {
    const [showLineNotes, setShowLineNotes] = useState(false);
    const lineNotesClickHandler = () => {
        setShowLineNotes(!showLineNotes);
    };

    const [notes, setNotes] = useState(cartLine.notes);

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.currentTarget.value);
    };

    const blurHandler = () => {
        onNotesChange(notes);
    };

    const heading = showLineNotes
        ? "Hide Line Notes"
        : (cartLine.notes.length === 0)
            ? "Add Line Notes"
            : "Show Line Notes";

    const [styles] = React.useState(() => mergeToNew(cartLineNotesStyles, extendedStyles));

    if (editable) {
        return (
            <StyledWrapper {...styles.wrapper}>
                <Link {...styles.toggleLink} onClick={lineNotesClickHandler} data-test-selector="cartline_notesShowHideButton">
                    {translate(heading)}
                </Link>
                {showLineNotes
                    && <TextArea
                        {...styles.editableNotesTextArea}
                        value={notes}
                        disabled={!cart.canModifyOrder}
                        onChange={changeHandler}
                        onBlur={blurHandler}
                        data-test-selector="cartline_notes" />
                }
            </StyledWrapper>
        );
    }

    if (!cartLine.notes) {
        return null;
    }

    return (
        <SmallHeadingAndText
            {...styles.readOnlyNotesText}
            heading={label || translate("Item Notes")}
            text={cartLine.notes}
        />
    );
};

export default withCartLine(CartLineNotes);
