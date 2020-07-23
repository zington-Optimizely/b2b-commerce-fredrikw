import { loadCategories, selectCategory } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import sortBy from "lodash/sortBy";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {

}

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => ({
    selectedCategoryPath: state.pageEditor.selectedCategoryPath,
    categories: state.pageEditor.categories,
});

const mapDispatchToProps = {
    selectCategory,
    loadCategories,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class CategorySelection extends React.Component<Props> {
    UNSAFE_componentWillMount(): void {
        if (!this.props.categories) {
            this.props.loadCategories();
        }
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.selectCategory(event.currentTarget.value);
    };

    getValue = () => {
        return this.props.selectedCategoryPath ? this.props.selectedCategoryPath : "";
    };

    render() {
        if (!this.props.categories) {
            return null;
        }

        return <Wrapper>
            <label>
                Category:
                <select onChange={this.onChange} value={this.getValue()}>
                    <option key="" value="">Select Category</option>
                    {sortBy(this.props.categories, [o => o.displayName]).map(category =>
                        <option key={category.id} value={category.path}>{category.displayName}</option>,
                    )}
                </select>
            </label>
        </Wrapper>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelection);

const Wrapper = styled.div`
    white-space: nowrap;
    max-width: 50%;
    select {
        max-width: 100%;
    }
`;
