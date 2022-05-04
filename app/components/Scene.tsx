import * as React from "react";
import styled from "styled-components";
import CenteredContent from "~/components/CenteredContent";
import Header from "~/components/Header";
import PageTitle from "~/components/PageTitle";

type Props = {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  textTitle?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  centered?: boolean;
};

const Scene: React.FC<Props> = ({
  title,
  icon,
  textTitle,
  actions,
  breadcrumb,
  children,
  centered,
}) => {
  return (
    <FillWidth>
      <PageTitle title={textTitle || title} />
      <Header
        hasSidebar
        title={
          icon ? (
            <>
              {icon}&nbsp;{title}
            </>
          ) : (
            title
          )
        }
        actions={actions}
        breadcrumb={breadcrumb}
      />
      {centered !== false ? (
        <CenteredContent withStickyHeader>{children}</CenteredContent>
      ) : (
        children
      )}
    </FillWidth>
  );
};

const FillWidth = styled.div`
  width: 100%;
`;

export default Scene;
