import React from "react";
import { ImagePickerFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import StandardControl from "@insite/shell/Components/ItemEditor/StandardControl";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import Button from "@insite/mobius/Button";
import translate from "@insite/client-framework/Translate";
import styled, { css } from "styled-components";
import MobiusTextField from "@insite/mobius/TextField";
import Scrim from "@insite/mobius/Overlay/Scrim";

type Props = ContentItemFieldProps<string, ImagePickerFieldDefinition>;

type State = {
    imagePickerIsOpen?: true;
};

export default class ImagePickerField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }

    changeImageHandler = () => {
        this.setState({ imagePickerIsOpen: true });

        (window as any).CKFinder.modal({
            chooseFiles: true,
            chooseFilesClosePopup: true,
            onInit: (finder: any) => {
                const hideOverlay = () => this.setState({ imagePickerIsOpen: undefined });

                document.getElementById("ckf-modal-close")?.addEventListener("click", hideOverlay);
                finder.on("files:choose", (evt: any) => {
                    hideOverlay();
                    this.props.updateField(this.props.fieldDefinition.name, evt.data.files.first().getUrl());
                });
                finder.on("file:choose:resizedImage", (evt: any) => {
                    hideOverlay();
                    this.props.updateField(this.props.fieldDefinition.name, evt.data.resizedUrl);
                });
            },
        });
    };

    deleteImageHandler = () => {
        this.props.updateField(this.props.fieldDefinition.name, "");
    };

    imageUrlChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {

        return <StandardControl fieldDefinition={this.props.fieldDefinition}>
            <Wrapper>
                {this.state.imagePickerIsOpen && <Scrim zIndexLevel="modal" />}
                {this.props.fieldValue
                    && <>
                        <Button css={changedImageButtonStyles} onClick={this.changeImageHandler} variant="secondary">{translate("Change")}</Button>
                        <Button onClick={this.deleteImageHandler} variant="secondary">{translate("Delete")}</Button>
                    </>
                }
                {!this.props.fieldValue
                    && <Button
                        onClick={this.changeImageHandler}
                        variant="secondary">
                        {translate("Add Image")}
                    </Button>
                }
                <Label htmlFor={this.props.fieldDefinition.name}>
                    {this.props.fieldDefinition.displayName}
                </Label>
                <MobiusTextField
                    id={this.props.fieldDefinition.name}
                    type="text"
                    value={this.props.fieldValue}
                    onChange={this.imageUrlChangeHandler} />
            </Wrapper>
        </StandardControl>;
    }
}

const changedImageButtonStyles = css`
    margin-right: 10px;
    height: 32px;
    border-radius: 3px;
    border-width: 1px;
    padding: 0 16px;
`;

const Wrapper = styled.div` padding-top: 10px; `;

const Label = styled.label`
    display: block;
    font-size: 16px;
    line-height: 21px;
    font-weight: bold;
    margin: 25px 0 -4px;
    text-transform: uppercase;
    position: relative;
`;
