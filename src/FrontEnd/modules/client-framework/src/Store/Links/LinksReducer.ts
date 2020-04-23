import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import { Draft } from "immer";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import { CategoryCollectionModel, CategoryModel } from "@insite/client-framework/Types/ApiModels";

const initialState: LinksState = {
    pageLinks: [],
    pageTypesToNodeId: {},
    nodeIdToPageLinkPath: {},
    UNSAFE_categoryLinksById: {},
    UNSAFE_categoryDepthLoaded: {},
    parentCategoryIdToChildrenIds: {},
};

const reducer = {
    "Links/BeginLoadPageLinks": (draft: Draft<LinksState>) => {
    },

    "Links/CompleteLoadPageLinks": (draft: Draft<LinksState>, action: { pageLinks: PageLinkModel[]; }) => {
        draft.pageLinks = action.pageLinks;
        draft.nodeIdToPageLinkPath = {};
        draft.pageTypesToNodeId = {};

        const loadLinks = (pageLinks: PageLinkModel[], path: number[], parentId?: string) => {
            let index = 0;
            for (const pageLink of pageLinks) {
                const childPath = path.concat([index]);
                draft.nodeIdToPageLinkPath[pageLink.id] = childPath;
                if (pageLink.type) {
                    draft.pageTypesToNodeId[pageLink.type] = pageLink.id;
                }
                if (pageLink.children) {
                    loadLinks(pageLink.children, childPath, pageLink.id);
                }

                pageLink.parentId = parentId;

                index++;
            }
        };

        loadLinks(draft.pageLinks, []);
    },

    "Links/BeginLoadCategories": (draft: Draft<LinksState>) => {
    },

    "Links/CompleteLoadCategories": (draft: Draft<LinksState>, action: { categories: CategoryCollectionModel, startCategoryId: string, depth: number}) => {
        const { parentCategoryIdToChildrenIds, UNSAFE_categoryLinksById, UNSAFE_categoryDepthLoaded } = draft;
        const { depth, startCategoryId, categories: { categories } } = action;
        const loadCategories = (categories: CategoryModel[], parentCategoryId: string, currentDepth: number) => {
            UNSAFE_categoryDepthLoaded[parentCategoryId] = depth - currentDepth;
            if (categories.length === 0) { // an empty array indicates there are sub categories, but they weren't returned by the api
                return;
            }
            const ids: string[] = [];
            parentCategoryIdToChildrenIds[parentCategoryId] = ids;
            for (const category of categories) {
                const { subCategories, id } = category;
                delete category.subCategories;
                UNSAFE_categoryLinksById[id] = category;
                ids.push(id);
                if (subCategories) {
                    loadCategories(subCategories, id, currentDepth + 1);
                } else if (currentDepth < action.depth) { // null means there were no sub categories, fill it in so we don't try to load it later
                    parentCategoryIdToChildrenIds[id] = [];
                    UNSAFE_categoryDepthLoaded[id] = 99;
                }
            }
        };

        loadCategories(categories!, startCategoryId, 0);
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
