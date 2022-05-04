import { toggleMark } from "prosemirror-commands";
import { InputRule } from "prosemirror-inputrules";
import { TokenConfig } from "prosemirror-markdown";
import {
  MarkSpec,
  MarkType,
  Node as ProsemirrorNode,
  Schema,
} from "prosemirror-model";
import Extension, { Command, CommandFactory } from "../lib/Extension";
import { MarkdownSerializerState } from "../lib/markdown/serializer";

export default abstract class Mark extends Extension {
  get type() {
    return "mark";
  }

  get schema(): MarkSpec {
    return {};
  }

  get markdownToken(): string {
    return "";
  }

  keys(_options: { type: MarkType; schema: Schema }): Record<string, Command> {
    return {};
  }

  inputRules(_options: { type: MarkType; schema: Schema }): InputRule[] {
    return [];
  }

  toMarkdown(state: MarkdownSerializerState, node: ProsemirrorNode) {
    console.error("toMarkdown not implemented", state, node);
  }

  parseMarkdown(): TokenConfig | void {
    return undefined;
  }

  commands({ type }: { type: MarkType; schema: Schema }): CommandFactory {
    return () => toggleMark(type);
  }
}
