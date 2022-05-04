import { useMatches, KBarResults } from "kbar";
import * as React from "react";
import styled from "styled-components";
import CommandBarItem from "~/components/CommandBarItem";

export default function CommandBarResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      maxHeight={400}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <Header>{item}</Header>
        ) : (
          <CommandBarItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
}

const Header = styled.h3`
  font-size: 13px;
  letter-spacing: 0.04em;
  margin: 0;
  padding: 16px 0 4px 20px;
  color: ${(props) => props.theme.textTertiary};
  height: 36px;
`;
