import { memo } from 'react';

import { getCellStyle, getCellClassname } from './utils';
import type { CalculatedColumn } from './types';
import type { GroupRowRendererProps } from './GroupRow';
import { AirtableGroupFormatter } from './formatters';

type SharedGroupRowRendererProps<R, SR> = Pick<
  GroupRowRendererProps<R, SR>,
  'id' | 'rowIdx' | 'groupKey' | 'childRows' | 'isExpanded' | 'toggleGroup'
>;

interface GroupCellProps<R, SR> extends SharedGroupRowRendererProps<R, SR> {
  column: CalculatedColumn<R, SR>;
  isCellSelected: boolean;
  groupColumnIndex: number;
  level: number;
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
  toggleGroup: toggleGroupWrapper,
}: GroupCellProps<R, SR>) {
  function toggleGroup() {
    toggleGroupWrapper(id);
  }

  // Only make the cell clickable if the group level matches
  const isLevelMatching = column.rowGroup && groupColumnIndex === column.idx;

  let style = {}

  if(column.idx === 0) {
    style = {
      gridColumn: `1 / span 3`,
      paddingLeft: level * 20 + 10,
      border: 'none'
    }
    column.groupFormatter = AirtableGroupFormatter;
    column.rowGroup = false;
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
        />
      )}
    </div>
  );
}

export default memo(GroupCell) as <R, SR>(props: GroupCellProps<R, SR>) => JSX.Element;
