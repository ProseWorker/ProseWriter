import { ActionImpl } from "kbar";
import { ArrowIcon, BackIcon } from "outline-icons";
import * as React from "react";
import styled, { css, useTheme } from "styled-components";
import Flex from "~/components/Flex";
import Key from "~/components/Key";

type Props = {
  action: ActionImpl;
  active: boolean;
  currentRootActionId: string | null | undefined;
};

function CommandBarItem(
  { action, active, currentRootActionId }: Props,
  ref: React.RefObject<HTMLDivElement>
) {
  const theme = useTheme();
  const ancestors = React.useMemo(() => {
    if (!currentRootActionId) {
      return action.ancestors;
    }
    const index = action.ancestors.findIndex(
      (ancestor) => ancestor.id === currentRootActionId
    );

    // +1 removes the currentRootAction; e.g. if we are on the "Set theme"
    // parent action, the UI should not display "Set theme… > Dark" but rather
    // just "Dark"
    return action.ancestors.slice(index + 1);
  }, [action.ancestors, currentRootActionId]);

  return (
    <Item active={active} ref={ref}>
      <Content align="center" gap={8}>
        <Icon>
          {action.icon ? (
            // @ts-expect-error no icon on ActionImpl
            React.cloneElement(action.icon, {
              size: 22,
              color: "currentColor",
            })
          ) : (
            <ArrowIcon color="currentColor" />
          )}
        </Icon>

        {ancestors.map((ancestor) => (
          <React.Fragment key={ancestor.id}>
            <Ancestor>{ancestor.name}</Ancestor>
            <ForwardIcon color={theme.textSecondary} size={22} />
          </React.Fragment>
        ))}
        {action.name}
        {action.children?.length ? "…" : ""}
      </Content>
      {action.shortcut?.length ? (
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gap: "4px",
          }}
        >
          {action.shortcut.map((sc: string) => (
            <Key key={sc}>{sc}</Key>
          ))}
        </div>
      ) : null}
    </Item>
  );
}

const Icon = styled(Flex)`
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.textSecondary};
  flex-shrink: 0;
`;

const Ancestor = styled.span`
  color: ${(props) => props.theme.textSecondary};
`;

const Content = styled(Flex)`
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
`;

const Item = styled.div<{ active?: boolean }>`
  font-size: 15px;
  padding: 10px 16px;
  background: ${(props) =>
    props.active ? props.theme.menuItemSelected : "none"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;

  ${(props) =>
    props.active &&
    css`
      ${Icon} {
        color: ${props.theme.text};
      }
    `}
`;

const ForwardIcon = styled(BackIcon)`
  transform: rotate(180deg);
  flex-shrink: 0;
`;

export default React.forwardRef<HTMLDivElement, Props>(CommandBarItem);
