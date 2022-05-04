import { isEqual } from "lodash";
import { observer } from "mobx-react";
import { CollapsedIcon } from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useTable, useSortBy, usePagination } from "react-table";
import styled from "styled-components";
import Button from "~/components/Button";
import DelayedMount from "~/components/DelayedMount";
import Empty from "~/components/Empty";
import Flex from "~/components/Flex";
import NudeButton from "~/components/NudeButton";
import PlaceholderText from "~/components/PlaceholderText";

export type Props = {
  data: any[];
  offset?: number;
  isLoading: boolean;
  empty?: React.ReactNode;
  currentPage?: number;
  page: number;
  pageSize?: number;
  totalPages?: number;
  defaultSort?: string;
  topRef?: React.Ref<any>;
  onChangePage: (index: number) => void;
  onChangeSort: (
    sort: string | null | undefined,
    direction: "ASC" | "DESC"
  ) => void;
  columns: any;
  defaultSortDirection: "ASC" | "DESC";
};

function Table({
  data,
  isLoading,
  totalPages,
  empty,
  columns,
  page,
  pageSize = 50,
  defaultSort = "name",
  topRef,
  onChangeSort,
  onChangePage,
  defaultSortDirection,
}: Props) {
  const { t } = useTranslation();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canNextPage,
    nextPage,
    canPreviousPage,
    previousPage,
    state: { pageIndex, sortBy },
  } = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      autoResetSortBy: false,
      autoResetPage: false,
      pageCount: totalPages,
      initialState: {
        sortBy: [
          {
            id: defaultSort,
            desc: defaultSortDirection === "DESC" ? true : false,
          },
        ],
        pageSize,
        pageIndex: page,
      },
      stateReducer: (newState, action, prevState) => {
        if (!isEqual(newState.sortBy, prevState.sortBy)) {
          return { ...newState, pageIndex: 0 };
        }

        return newState;
      },
    },
    useSortBy,
    usePagination
  );
  const prevSortBy = React.useRef(sortBy);

  React.useEffect(() => {
    if (!isEqual(sortBy, prevSortBy.current)) {
      prevSortBy.current = sortBy;
      onChangePage(0);
      onChangeSort(
        sortBy.length ? sortBy[0].id : undefined,
        !sortBy.length ? defaultSortDirection : sortBy[0].desc ? "DESC" : "ASC"
      );
    }
  }, [defaultSortDirection, onChangePage, onChangeSort, sortBy]);

  const handleNextPage = () => {
    nextPage();
    onChangePage(pageIndex + 1);
  };

  const handlePreviousPage = () => {
    previousPage();
    onChangePage(pageIndex - 1);
  };

  const isEmpty = !isLoading && data.length === 0;
  const showPlaceholder = isLoading && data.length === 0;

  return (
    <>
      <Anchor ref={topRef} />
      <InnerTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Head {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <SortWrapper
                    align="center"
                    $sortable={!column.disableSortBy}
                    gap={4}
                  >
                    {column.render("Header")}
                    {column.isSorted &&
                      (column.isSortedDesc ? (
                        <DescSortIcon />
                      ) : (
                        <AscSortIcon />
                      ))}
                  </SortWrapper>
                </Head>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Row {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Cell
                    {...cell.getCellProps([
                      {
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'className' does not exist on type 'Colum... Remove this comment to see the full error message
                        className: cell.column.className,
                      },
                    ])}
                  >
                    {cell.render("Cell")}
                  </Cell>
                ))}
              </Row>
            );
          })}
        </tbody>
        {showPlaceholder && <Placeholder columns={columns.length} />}
      </InnerTable>
      {isEmpty ? (
        empty || <Empty>{t("No results")}</Empty>
      ) : (
        <Pagination
          justify={canPreviousPage ? "space-between" : "flex-end"}
          gap={8}
        >
          {/* Note: the page > 0 check shouldn't be needed here but is */}
          {canPreviousPage && page > 0 && (
            <Button onClick={handlePreviousPage} neutral>
              {t("Previous page")}
            </Button>
          )}
          {canNextPage && (
            <Button onClick={handleNextPage} neutral>
              {t("Next page")}
            </Button>
          )}
        </Pagination>
      )}
    </>
  );
}

export const Placeholder = ({
  columns,
  rows = 3,
}: {
  columns: number;
  rows?: number;
}) => {
  return (
    <DelayedMount>
      <tbody>
        {new Array(rows).fill(1).map((_, row) => (
          <Row key={row}>
            {new Array(columns).fill(1).map((_, col) => (
              <Cell key={col}>
                <PlaceholderText minWidth={25} maxWidth={75} />
              </Cell>
            ))}
          </Row>
        ))}
      </tbody>
    </DelayedMount>
  );
};

const Anchor = styled.div`
  top: -32px;
  position: relative;
`;

const Pagination = styled(Flex)`
  margin: 0 0 32px;
`;

const DescSortIcon = styled(CollapsedIcon)`
  margin-left: -2px;

  &:hover {
    fill: ${(props) => props.theme.text};
  }
`;

const AscSortIcon = styled(DescSortIcon)`
  transform: rotate(180deg);
`;

const InnerTable = styled.table`
  border-collapse: collapse;
  margin: 16px 0;
  width: 100%;
`;

const SortWrapper = styled(Flex)<{ $sortable: boolean }>`
  display: inline-flex;
  height: 24px;
  user-select: none;
  border-radius: 4px;
  white-space: nowrap;
  margin: 0 -4px;
  padding: 0 4px;

  &:hover {
    background: ${(props) =>
      props.$sortable ? props.theme.secondaryBackground : "none"};
  }
`;

const Cell = styled.td`
  padding: 10px 6px;
  border-bottom: 1px solid ${(props) => props.theme.divider};
  font-size: 14px;

  &:first-child {
    font-size: 15px;
    font-weight: 500;
  }

  &.actions,
  &.right-aligned {
    text-align: right;
    vertical-align: bottom;
  }

  ${NudeButton} {
    &:hover,
    &[aria-expanded="true"] {
      background: ${(props) => props.theme.sidebarControlHoverBackground};
    }
  }
`;

const Row = styled.tr`
  ${Cell} {
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }
  &:last-child {
    ${Cell} {
      border-bottom: 0;
    }
  }
`;

const Head = styled.th`
  text-align: left;
  position: sticky;
  top: 54px;
  padding: 6px 6px 0;
  border-bottom: 1px solid ${(props) => props.theme.divider};
  background: ${(props) => props.theme.background};
  transition: ${(props) => props.theme.backgroundTransition};
  font-size: 14px;
  color: ${(props) => props.theme.textSecondary};
  font-weight: 500;
  z-index: 1;

  :first-child {
    padding-left: 0;
  }

  :last-child {
    padding-right: 0;
  }
`;

export default observer(Table);
