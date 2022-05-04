import isPrintableKeyEvent from "is-printable-key-event";
import * as React from "react";
import styled from "styled-components";
import useOnScreen from "~/hooks/useOnScreen";

type Props = Omit<React.HTMLAttributes<HTMLSpanElement>, "ref" | "onChange"> & {
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onChange?: (text: string) => void;
  onBlur?: React.FocusEventHandler<HTMLSpanElement> | undefined;
  onInput?: React.FormEventHandler<HTMLSpanElement> | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLSpanElement> | undefined;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
  children?: React.ReactNode;
  value: string;
};

export type RefHandle = {
  focus: () => void;
  focusAtStart: () => void;
  focusAtEnd: () => void;
  getComputedDirection: () => string;
};

/**
 * Defines a content editable component with the same interface as a native
 * HTMLInputElement (or, as close as we can get).
 */
const ContentEditable = React.forwardRef(
  (
    {
      disabled,
      onChange,
      onInput,
      onBlur,
      onKeyDown,
      value,
      children,
      className,
      maxLength,
      autoFocus,
      placeholder,
      readOnly,
      dir,
      onClick,
      ...rest
    }: Props,
    ref: React.RefObject<RefHandle>
  ) => {
    const contentRef = React.useRef<HTMLSpanElement>(null);
    const [innerValue, setInnerValue] = React.useState<string>(value);
    const lastValue = React.useRef("");

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        contentRef.current?.focus();
      },
      focusAtStart: () => {
        if (contentRef.current) {
          contentRef.current.focus();
          placeCaret(contentRef.current, true);
        }
      },
      focusAtEnd: () => {
        if (contentRef.current) {
          contentRef.current.focus();
          placeCaret(contentRef.current, false);
        }
      },
      getComputedDirection: () => {
        if (contentRef.current) {
          return window.getComputedStyle(contentRef.current).direction;
        }
        return "ltr";
      },
    }));

    const wrappedEvent = (
      callback:
        | React.FocusEventHandler<HTMLSpanElement>
        | React.FormEventHandler<HTMLSpanElement>
        | React.KeyboardEventHandler<HTMLSpanElement>
        | undefined
    ) => (event: any) => {
      const text = contentRef.current?.innerText || "";

      if (maxLength && isPrintableKeyEvent(event) && text.length >= maxLength) {
        event?.preventDefault();
        return;
      }

      if (text !== lastValue.current) {
        lastValue.current = text;
        onChange && onChange(text);
      }

      callback?.(event);
    };

    // This is to account for being within a React.Suspense boundary, in this
    // case the component may be rendered with display: none. React 18 may solve
    // this in the future by delaying useEffect hooks:
    // https://github.com/facebook/react/issues/14536#issuecomment-861980492
    const isVisible = useOnScreen(contentRef);

    React.useEffect(() => {
      if (autoFocus && isVisible && !disabled && !readOnly) {
        contentRef.current?.focus();
      }
    }, [autoFocus, disabled, isVisible, readOnly, contentRef]);

    React.useEffect(() => {
      if (value !== contentRef.current?.innerText) {
        setInnerValue(value);
      }
    }, [value, contentRef]);

    // Ensure only plain text can be pasted into title when pasting from another
    // rich text editor
    const handlePaste = React.useCallback(
      (event: React.ClipboardEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const text = event.clipboardData.getData("text/plain");
        window.document.execCommand("insertText", false, text);
      },
      []
    );

    return (
      <div className={className} dir={dir} onClick={onClick}>
        <Content
          ref={contentRef}
          contentEditable={!disabled && !readOnly}
          onInput={wrappedEvent(onInput)}
          onBlur={wrappedEvent(onBlur)}
          onKeyDown={wrappedEvent(onKeyDown)}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          suppressContentEditableWarning
          role="textbox"
          {...rest}
        >
          {innerValue}
        </Content>
        {children}
      </div>
    );
  }
);

function placeCaret(element: HTMLElement, atStart: boolean) {
  if (
    typeof window.getSelection !== "undefined" &&
    typeof document.createRange !== "undefined"
  ) {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(atStart);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

const Content = styled.span`
  background: ${(props) => props.theme.background};
  transition: ${(props) => props.theme.backgroundTransition};
  color: ${(props) => props.theme.text};
  -webkit-text-fill-color: ${(props) => props.theme.text};
  outline: none;
  resize: none;
  cursor: text;

  &:empty {
    display: inline-block;
  }

  &:empty::before {
    display: inline-block;
    color: ${(props) => props.theme.placeholder};
    -webkit-text-fill-color: ${(props) => props.theme.placeholder};
    content: attr(data-placeholder);
    pointer-events: none;
    height: 0;
  }
`;

export default ContentEditable;
