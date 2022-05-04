import { InputRule } from "prosemirror-inputrules";
import { Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import {
  getCurrentDateAsString,
  getCurrentDateTimeAsString,
  getCurrentTimeAsString,
} from "../../utils/date";
import Extension from "../lib/Extension";
import { Dispatch, EventType } from "../types";

/**
 * An editor extension that adds commands to insert the current date and time.
 */
export default class DateTime extends Extension {
  get name() {
    return "date_time";
  }

  inputRules() {
    return [
      // Note: There is a space at the end of the pattern here otherwise the
      // /datetime rule can never be matched.
      // these extra input patterns are needed until the block menu matches
      // in places other than the start of a line
      new InputRule(/\/date\s$/, ({ tr }, _match, start, end) => {
        tr.delete(start, end).insertText(getCurrentDateAsString() + " ");
        this.editor.events.emit(EventType.blockMenuClose);
        return tr;
      }),
      new InputRule(/\/time\s$/, ({ tr }, _match, start, end) => {
        tr.delete(start, end).insertText(getCurrentTimeAsString() + " ");
        this.editor.events.emit(EventType.blockMenuClose);
        return tr;
      }),
      new InputRule(/\/datetime\s$/, ({ tr }, _match, start, end) => {
        tr.delete(start, end).insertText(`${getCurrentDateTimeAsString()} `);
        this.editor.events.emit(EventType.blockMenuClose);
        return tr;
      }),
    ];
  }

  commands(_options: { schema: Schema }) {
    return {
      date: () => (state: EditorState, dispatch: Dispatch) => {
        dispatch(state.tr.insertText(getCurrentDateAsString() + " "));
        return true;
      },
      time: () => (state: EditorState, dispatch: Dispatch) => {
        dispatch(state.tr.insertText(getCurrentTimeAsString() + " "));
        return true;
      },
      datetime: () => (state: EditorState, dispatch: Dispatch) => {
        dispatch(state.tr.insertText(getCurrentDateTimeAsString() + " "));
        return true;
      },
    };
  }
}
