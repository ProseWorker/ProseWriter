import Token from "markdown-it/lib/token";
import { WarningIcon, InfoIcon, StarredIcon } from "outline-icons";
import { wrappingInputRule } from "prosemirror-inputrules";
import { NodeSpec, Node as ProsemirrorNode, NodeType } from "prosemirror-model";
import * as React from "react";
import ReactDOM from "react-dom";
import toggleWrap from "../commands/toggleWrap";
import { MarkdownSerializerState } from "../lib/markdown/serializer";
import noticesRule from "../rules/notices";
import Node from "./Node";

export default class Notice extends Node {
  get styleOptions() {
    return Object.entries({
      info: this.options.dictionary.info,
      warning: this.options.dictionary.warning,
      tip: this.options.dictionary.tip,
    });
  }

  get name() {
    return "container_notice";
  }

  get rulePlugins() {
    return [noticesRule];
  }

  get schema(): NodeSpec {
    return {
      attrs: {
        style: {
          default: "info",
        },
      },
      content: "block+",
      group: "block",
      defining: true,
      draggable: true,
      parseDOM: [
        {
          tag: "div.notice-block",
          preserveWhitespace: "full",
          contentElement: "div.content",
          getAttrs: (dom: HTMLDivElement) => ({
            style: dom.className.includes("tip")
              ? "tip"
              : dom.className.includes("warning")
              ? "warning"
              : undefined,
          }),
        },
      ],
      toDOM: (node) => {
        const select = document.createElement("select");
        select.addEventListener("change", this.handleStyleChange);

        this.styleOptions.forEach(([key, label]) => {
          const option = document.createElement("option");
          option.value = key;
          option.innerText = label;
          option.selected = node.attrs.style === key;
          select.appendChild(option);
        });

        const actions = document.createElement("div");
        actions.className = "notice-actions";
        actions.appendChild(select);

        let component;

        if (node.attrs.style === "tip") {
          component = <StarredIcon color="currentColor" />;
        } else if (node.attrs.style === "warning") {
          component = <WarningIcon color="currentColor" />;
        } else {
          component = <InfoIcon color="currentColor" />;
        }

        const icon = document.createElement("div");
        icon.className = "icon";
        ReactDOM.render(component, icon);

        return [
          "div",
          { class: `notice-block ${node.attrs.style}` },
          icon,
          ["div", { contentEditable: "false" }, actions],
          ["div", { class: "content" }, 0],
        ];
      },
    };
  }

  commands({ type }: { type: NodeType }) {
    return (attrs: Record<string, any>) => toggleWrap(type, attrs);
  }

  handleStyleChange = (event: InputEvent) => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    if (!(element instanceof HTMLSelectElement)) {
      return;
    }

    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        style: element.value,
      });
      view.dispatch(transaction);
    }
  };

  inputRules({ type }: { type: NodeType }) {
    return [wrappingInputRule(/^:::$/, type)];
  }

  toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode) {
    state.write("\n:::" + (node.attrs.style || "info") + "\n");
    state.renderContent(node);
    state.ensureNewLine();
    state.write(":::");
    state.closeBlock(node);
  }

  parseMarkdown() {
    return {
      block: "container_notice",
      getAttrs: (tok: Token) => ({ style: tok.info }),
    };
  }
}
