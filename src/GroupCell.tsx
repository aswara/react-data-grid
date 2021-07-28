import { memo } from 'react';

import { getCellStyle, getCellClassname } from './utils';
import type { CalculatedColumn } from './types';
import type { GroupRowRendererProps } from './GroupRow';
import { kontenbaseGroupFormatter } from './formatters';

type SharedGroupRowRendererProps<R, SR> = Pick<
  GroupRowRendererProps<R, SR>,
  'id' | 'rowIdx' | 'groupKey' | 'childRows' | 'isExpanded' | 'toggleGroup'
>;

interface GroupCellProps<R, SR> extends SharedGroupRowRendererProps<R, SR> {
  column: CalculatedColumn<R, SR>;
  isCellSelected: boolean;
  groupColumnIndex: number;
  level: number;
  theme: string;
  groupColumn: CalculatedColumn<R, SR> | undefined;
}

function GroupCell<R, SR>({
  id,
  rowIdx,
  groupKey,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  groupColumnIndex,
  level,
  theme,
  groupColumn,
  columns,
  toggleGroup: toggleGroupWrapper,
}: GroupCellProps<R, SR>) {
  function toggleGroup() {
    toggleGroupWrapper(id);
  }

  // Only make the cell clickable if the group level matches
  const isLevelMatching = column.rowGroup && groupColumnIndex === column.idx;

  let style = {}

  if(theme === "kontenbase" && column.idx === 0) {
    style = {
      gridColumn: `1 / span 4`,
      paddingLeft: level  * 16,
      border: 'none',
    }
    
    column.rowGroup = false;

    if (!column.groupFormatter) {
      column.groupFormatter = kontenbaseGroupFormatter;
    }
  }

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      key={column.key}
      className={getCellClassname(column)}
      style={{
        ...getCellStyle(column),
        cursor: isLevelMatching ? 'pointer' : 'default',
        ...style,
      }}
      onClick={isLevelMatching ? toggleGroup : undefined}
    >
      {  (!column.rowGroup || groupColumnIndex === column.idx) && column.groupFormatter && (
        <column.groupFormatter
          rowIdx={rowIdx}
          groupKey={groupKey}
          childRows={childRows}
          column={column}
          isExpanded={isExpanded}
          isCellSelected={isCellSelected}
          toggleGroup={toggleGroup}
          groupColumn={groupColumn}
        />
      )}
    </div>
  );
}

export default memo(GroupCell) as <R, SR>(props: GroupCellProps<R, SR>) => JSX.Element;
