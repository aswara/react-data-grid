import { memo, forwardRef } from 'react';
import type { RefAttributes, CSSProperties } from 'react';
import clsx from 'clsx';

import { groupRowSelectedClassname, rowClassname } from './style';
import { getColSpan } from './utils';
import Cell from './Cell';
import EditCell from './EditCell';
import type { RowRendererProps, SelectedCellProps } from './types';
import { RowSelectionProvider } from './hooks';

function Row<R, SR>(
  {
    className,
    rowIdx,
    isRowSelected,
    copiedCellIdx,
    draggedOverCellIdx,
    lastFrozenColumnIndex,
    row,
    viewportColumns,
    selectedCellProps,
    onRowClick,
    onRowDoubleClick,
    rowClass,
    setDraggedOverRowIdx,
    onMouseEnter,
    top,
    height,
    onRowChange,
    selectCell,
    theme,
    ...props
  }: RowRendererProps<R, SR>,
  ref: React.Ref<HTMLDivElement>
) {
  function handleDragEnter(event: React.MouseEvent<HTMLDivElement>) {
    setDraggedOverRowIdx?.(rowIdx);
    onMouseEnter?.(event);
  }

  className = clsx(
    rowClassname,
    `rdg-row-${rowIdx % 2 === 0 ? 'even' : 'odd'}`,
    {
      [groupRowSelectedClassname]: selectedCellProps?.idx === -1
    },
    rowClass?.(row),
    className
  );

  const cells = [];


  for (let index = 0; index < viewportColumns.length; index++) {
    const column = viewportColumns[index];
    let colSpan = getColSpan(column, lastFrozenColumnIndex, { type: 'ROW', row });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }

    if(row.id === 'DIVIDER') {
      colSpan = viewportColumns.length;
    }

    const isCellSelected = selectedCellProps?.idx === column.idx;
    if (selectedCellProps?.mode === 'EDIT' && isCellSelected) {
      cells.push(
        <EditCell
          key={column.key}
          rowIdx={rowIdx}
          column={column}
          colSpan={colSpan}
          onKeyDown={selectedCellProps.onKeyDown}
          {...selectedCellProps.editorProps}
        />
      );
      continue;
    }

    cells.push(
      <Cell
        key={column.key}
        rowIdx={rowIdx}
        column={column}
        colSpan={colSpan}
        row={row}
        isCopied={copiedCellIdx === column.idx}
        isDraggedOver={draggedOverCellIdx === column.idx}
        isCellSelected={isCellSelected}
        dragHandleProps={
          isCellSelected ? (selectedCellProps as SelectedCellProps).dragHandleProps : undefined
        }
        onFocus={isCellSelected ? (selectedCellProps as SelectedCellProps).onFocus : undefined}
        onKeyDown={isCellSelected ? selectedCellProps!.onKeyDown : undefined}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        onRowChange={onRowChange}
        selectCell={selectCell}
        theme={theme}
      />
    );
  }

  return (
    <RowSelectionProvider value={isRowSelected}>
      <div
        role="row"
        ref={ref}
        className={className}
        onMouseEnter={handleDragEnter}
        style={
          {
            top,
            '--row-height': `${height}px`
          } as unknown as CSSProperties
        }
        {...props}
      >
        {cells}
      </div>
    </RowSelectionProvider>
  );
}

export default memo(forwardRef(Row)) as <R, SR>(
  props: RowRendererProps<R, SR> & RefAttributes<HTMLDivElement>
) => JSX.Element;
