import styled from "styled-components";

const Divider = styled.hr`
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme.divider};
  margin: 0;
  padding: 0;
`;

export default Divider;
