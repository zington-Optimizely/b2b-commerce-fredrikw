import { loadProducts, selectProduct } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {

}

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => ({
    selectedProductPath: state.pageEditor.selectedProductPath,
    products: state.pageEditor.products,
});

const mapDispatchToProps = {
    selectProduct,
    loadProducts,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class ProductSelection extends React.Component<Props> {
    UNSAFE_componentWillMount(): void {
        if (!this.props.products) {
            this.props.loadProducts();
        }
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.selectProduct(event.currentTarget.value);
    };

    getValue = () => {
        return this.props.selectedProductPath ? this.props.selectedProductPath : "";
    };

    render() {
        if (!this.props.products) {
            return null;
        }

        return <Wrapper>
            <label>
                Product:
                <select onChange={this.onChange} value={this.getValue()}>
                    <option key="" value="">Select Product</option>
                    {this.props.products.map(product =>
                        <option key={product.id} value={product.path}>{product.shortDescription}</option>,
                    )}
                </select>
            </label>
        </Wrapper>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelection);

const Wrapper = styled.div`
    white-space: nowrap;
    max-width: 50%;
    select {
        max-width: 100%;
    }
`;
