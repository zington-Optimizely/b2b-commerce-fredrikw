import { loadBrands, selectBrand } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {

}

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => ({
    selectedBrandPath: state.pageEditor.selectedBrandPath,
    brands: state.pageEditor.brands,
});

const mapDispatchToProps = {
    selectBrand,
    loadBrands,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class BrandSelection extends React.Component<Props> {
    UNSAFE_componentWillMount(): void {
        if (!this.props.brands) {
            this.props.loadBrands();
        }
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.selectBrand(event.currentTarget.value);
    };

    getValue = () => {
        return this.props.selectedBrandPath || "";
    };

    render() {
        if (!this.props.brands) {
            return null;
        }

        return <Wrapper>
            <label>
                Brand:
                <select onChange={this.onChange} value={this.getValue()}>
                    <option key="">Select Brand</option>
                    {this.props.brands.map(brand =>
                        <option key={brand.id} value={brand.path}>{brand.name}</option>,
                    )}
                </select>
            </label>
        </Wrapper>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandSelection);

const Wrapper = styled.div`
    white-space: nowrap;
    max-width: 50%;
    select {
        max-width: 100%;
    }
`;
