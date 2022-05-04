import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import Flex from "~/components/Flex";

type Props = {
  label: React.ReactNode | string;
};

const Labeled: React.FC<Props> = ({ label, children, ...props }) => (
  <Flex column {...props}>
    <Label>{label}</Label>
    {children}
  </Flex>
);

export const Label = styled(Flex)`
  font-weight: 500;
  padding-bottom: 4px;
  display: inline-block;
  color: ${(props) => props.theme.text};
`;

export default observer(Labeled);
