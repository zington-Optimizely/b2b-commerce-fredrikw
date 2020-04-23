import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import { selectCategory, loadCategories } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import sortBy from "lodash/sortBy";

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

        return <div>
            <label>
                Category:
                <select onChange={this.onChange} value={this.getValue()}>
                    <option key="">Select Category</option>
                    {sortBy(this.props.categories, [o => o.displayName]).map(category =>
                        <option key={category.id} value={category.path}>{category.displayName}</option>,
                    )}
                </select>
            </label>
        </div>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelection);
