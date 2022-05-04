import { NodeType } from "prosemirror-model";
import { wrapInList, liftListItem } from "prosemirror-schema-list";
import { EditorState } from "prosemirror-state";
import { findParentNode } from "prosemirror-utils";
import chainTransactions from "../lib/chainTransactions";
import isList from "../queries/isList";
import { Dispatch } from "../types";
import clearNodes from "./clearNodes";

export default function toggleList(listType: NodeType, itemType: NodeType) {
  return (state: EditorState, dispatch?: Dispatch) => {
    const { schema, selection } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);
    const { tr } = state;

    if (!range) {
      return false;
    }

    const parentList = findParentNode((node) => isList(node, schema))(
      selection
    );

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType) {
        return liftListItem(itemType)(state, dispatch);
      }

      if (
        isList(parentList.node, schema) &&
        listType.validContent(parentList.node.content)
      ) {
        tr.setNodeMarkup(parentList.pos, listType);

        if (dispatch) {
          dispatch(tr);
        }

        return false;
      }
    }

    const canWrapInList = wrapInList(listType)(state);

    if (canWrapInList) {
      return wrapInList(listType)(state, dispatch);
    }

    return chainTransactions(clearNodes(), wrapInList(listType))(
      state,
      dispatch
    );
  };
}
