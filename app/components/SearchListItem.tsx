import { observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { CompositeItem } from "reakit/Composite";
import styled, { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import Document from "~/models/Document";
import Highlight, { Mark } from "~/components/Highlight";
import { hover } from "~/styles";

type Props = {
  document: Document;
  highlight: string;
  context: string | undefined;
  showParentDocuments?: boolean;
  showCollection?: boolean;
  showPublished?: boolean;
  shareId?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
const SEARCH_RESULT_REGEX = /<b\b[^>]*>(.*?)<\/b>/gi;

function replaceResultMarks(tag: string) {
  // don't use SEARCH_RESULT_REGEX here as it causes
  // an infinite loop to trigger a regex inside it's own callback
  return tag.replace(/<b\b[^>]*>(.*?)<\/b>/gi, "$1");
}

function DocumentListItem(
  props: Props,
  ref: React.RefObject<HTMLAnchorElement>
) {
  const { document, highlight, context, shareId, ...rest } = props;

  return (
    <CompositeItem
      as={DocumentLink}
      ref={ref}
      dir={document.dir}
      to={{
        pathname: shareId ? `/share/${shareId}${document.url}` : document.url,
        state: {
          title: document.titleWithDefault,
        },
      }}
      {...rest}
    >
      <Content>
        <Heading dir={document.dir}>
          <Title
            text={document.titleWithDefault}
            highlight={highlight}
            dir={document.dir}
          />
        </Heading>

        {
          <ResultContext
            text={context}
            highlight={highlight ? SEARCH_RESULT_REGEX : undefined}
            processResult={replaceResultMarks}
          />
        }
      </Content>
    </CompositeItem>
  );
}

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
`;

const DocumentLink = styled(Link)<{
  $isStarred?: boolean;
  $menuOpen?: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  max-height: 50vh;

  &:not(:last-child) {
    margin-bottom: 4px;
  }

  &:focus-visible {
    outline: none;
  }

  ${breakpoint("tablet")`
    width: auto;
  `};

  &:${hover},
  &:active,
  &:focus,
  &:focus-within {
    background: ${(props) => props.theme.listItemHoverBackground};
  }

  ${(props) =>
    props.$menuOpen &&
    css`
      background: ${(props) => props.theme.listItemHoverBackground};
    `}
`;

const Heading = styled.h4<{ rtl?: boolean }>`
  display: flex;
  justify-content: ${(props) => (props.rtl ? "flex-end" : "flex-start")};
  align-items: center;
  height: 18px;
  margin-top: 0;
  margin-bottom: 0.25em;
  overflow: hidden;
  white-space: nowrap;
  color: ${(props) => props.theme.text};
`;

const Title = styled(Highlight)`
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;

  ${Mark} {
    padding: 0;
  }
`;

const ResultContext = styled(Highlight)`
  display: block;
  color: ${(props) => props.theme.textTertiary};
  font-size: 14px;
  margin-top: -0.25em;
  margin-bottom: 0.25em;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${Mark} {
    padding: 0;
  }
`;

export default observer(React.forwardRef(DocumentListItem));
