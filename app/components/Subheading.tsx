import * as React from "react";
import styled from "styled-components";

type Props = {
  sticky?: boolean;
};

const H3 = styled.h3`
  border-bottom: 1px solid ${(props) => props.theme.divider};
  margin: 12px 0;
  line-height: 1;
`;

const Underline = styled.div`
  display: inline-block;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  color: ${(props) => props.theme.textSecondary};
  padding-top: 6px;
  padding-bottom: 6px;
`;

// When sticky we need extra background coverage around the sides otherwise
// items that scroll past can "stick out" the sides of the heading
const Background = styled.div<{ sticky?: boolean }>`
  position: ${(props) => (props.sticky ? "sticky" : "relative")};
  ${(props) => (props.sticky ? "top: 54px;" : "")}
  margin: 0 -8px;
  padding: 0 8px;
  background: ${(props) => props.theme.background};
  transition: ${(props) => props.theme.backgroundTransition};
  z-index: 1;
`;

const Subheading: React.FC<Props> = ({ children, sticky, ...rest }) => {
  return (
    <Background sticky={sticky}>
      <H3 {...rest}>
        <Underline>{children}</Underline>
      </H3>
    </Background>
  );
};

export default Subheading;
