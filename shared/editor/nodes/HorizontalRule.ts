import Token from "markdown-it/lib/token";
import { InputRule } from "prosemirror-inputrules";
import { NodeSpec, NodeType, Node as ProsemirrorNode } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { MarkdownSerializerState } from "../lib/markdown/serializer";
import { Dispatch } from "../types";
import Node from "./Node";

export default class HorizontalRule extends Node {
  get name() {
    return "hr";
  }

  get schema(): NodeSpec {
    return {
      attrs: {
        markup: {
          default: "---",
        },
      },
      group: "block",
      parseDOM: [{ tag: "hr" }],
      toDOM: (node) => {
        return [
          "hr",
          { class: node.attrs.markup === "***" ? "page-break" : "" },
        ];
      },
    };
  }

  commands({ type }: { type: NodeType }) {
    return (attrs: Record<string, any>) => (
      state: EditorState,
      dispatch: Dispatch
    ) => {
      dispatch(
        state.tr.replaceSelectionWith(type.create(attrs)).scrollIntoView()
      );
      return true;
    };
  }

  keys({ type }: { type: NodeType }) {
    return {
      "Mod-_": (state: EditorState, dispatch: Dispatch) => {
        dispatch(state.tr.replaceSelectionWith(type.create()).scrollIntoView());
        return true;
      },
    };
  }

  inputRules({ type }: { type: NodeType }) {
    return [
      new InputRule(/^(?:---|___\s|\*\*\*\s)$/, (state, match, start, end) => {
        const { tr } = state;

        if (match[0]) {
          const markup = match[0].trim();
          tr.replaceWith(start - 1, end, type.create({ markup }));
        }

        return tr;
      }),
    ];
  }

  toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode) {
    state.write(`\n${node.attrs.markup}`);
    state.closeBlock(node);
  }

  parseMarkdown() {
    return {
      node: "hr",
      getAttrs: (tok: Token) => ({
        markup: tok.markup,
      }),
    };
  }
}
