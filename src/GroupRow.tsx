import type { CSSProperties } from 'react';
import { memo } from 'react';
import clsx from 'clsx';

import { groupRowClassname, groupRowSelectedClassname, row, rowClassname } from './style';
import { SELECT_COLUMN_KEY } from './Columns';
import GroupCell from './GroupCell';
import type { CalculatedColumn, Position, Omit } from './types';
import { RowSelectionProvider } from './hooks';

export interface GroupRowRendererProps<R, SR>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  id: string;
  groupKey: unknown;
  viewportColumns: readonly CalculatedColumn<R, SR>[];
  columns: readonly CalculatedColumn<R, SR>[];
  childRows: readonly R[];
  rowIdx: number;
  top: number;
  height: number;
  level: number;
  selectedCellIdx: number | undefined;
  isExpanded: boolean;
  isRowSelected: boolean;
  selectCell: (position: Position, enableEditor?: boolean) => void;
  toggleGroup: (expandedGroupId: unknown) => void;
  theme: string;
  groupField: string;
}

function GroupedRow<R, SR>({
  id,
  groupKey,
  viewportColumns,
  childRows,
  rowIdx,
  top,
  height,
  level,
  isExpanded,
  selectedCellIdx,
  isRowSelected,
  selectCell,
  toggleGroup,
  theme,
  groupField,
  columns,
  ...props
}: GroupRowRendererProps<R, SR>) {
  // Select is always the first column
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;

  function selectGroup() {
    if(theme !== 'kontenbase') {
      selectCell({ rowIdx, idx: -1 });
    }
  }

  const groupColumn = columns.find(item => item.key === groupField);

  return (
    <RowSelectionProvider value={isRowSelected}>
      <div
        role="row"
        aria-level={level}
        aria-expanded={isExpanded}
        className={clsx(
          rowClassname,
          groupRowClassname,
          `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`,
          {
            [groupRowSelectedClassname]: selectedCellIdx === -1 // Select row if there is no selected cell
          }
        )}
        onClick={selectGroup}
        style={
          {
            top,
            '--row-height': `${height}px`
          } as unknown as CSSProperties
        }
        {...props}
      >
        {viewportColumns.map((column) => {

          return (

            <GroupCell
              key={column.key}
              id={id}
              rowIdx={rowIdx}
              groupKey={groupKey}
              childRows={childRows}
              isExpanded={isExpanded}
              isCellSelected={selectedCellIdx === column.idx}
              column={column}
              groupColumnIndex={idx}
              toggleGroup={toggleGroup}
              level={level}
              theme={theme}
              groupColumn={groupColumn}
            />
          )
        })}
      </div>
    </RowSelectionProvider>
  );
}

export default memo(GroupedRow) as <R, SR>(props: GroupRowRendererProps<R, SR>) => JSX.Element;
