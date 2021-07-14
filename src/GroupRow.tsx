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
  ...props
}: GroupRowRendererProps<R, SR>) {
  // Select is always the first column
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;

  function selectGroup() {
    if(theme !== 'airtable') {
      selectCell({ rowIdx, idx: -1 });
    }
  }

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
          // if(column.idx === 0) {
          //   const divider = []

          //   for (let index = 0; index < level ; index++) {
          //     divider.push(
          //       <div
          //         style={{
          //           height,
          //           width: 20,
          //           borderLeft: '1px solid lightgray',
          //         }}
          //        />
          //     )
              
          //   }

          //   return (
          //     <div
          //       style={{
          //         display: 'flex'
          //       }}
          //     >
          //       {/* {divider} */}
          //       {/* <div 
          //         style={{
          //           borderTop: '1px solid lightgray',
          //           borderLeft: '1px solid lightgray',
          //           flexGrow: 1,
          //           borderTopLeftRadius: 8,
          //         }}
          //       /> */}
          //       </div>
          //   )
          // }

          // if( theme === 'airtable' && column.idx === 1) {
          //   return (
          //     <div
          //       style={{
          //         borderBottom: '1px solid lightgray',
          //         // left: level * 20 + 10,
          //         // zIndex: 10,
          //         // position: 'absolute'
          //       }}
          //     >
          //       <AirtableGroupFormatter 
          //         groupKey={groupKey}
          //         rowIdx={rowIdx}
          //         toggleGroup={() => toggleGroup(id)}
          //         isExpanded={isExpanded}
          //         column={column}
          //         childRows={childRows}
          //         isCellSelected={selectedCellIdx === column.idx}
          //     />
          //     </div>
          //   )
          // }

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
            />
          )
        })}
      </div>
    </RowSelectionProvider>
  );
}

export default memo(GroupedRow) as <R, SR>(props: GroupRowRendererProps<R, SR>) => JSX.Element;
