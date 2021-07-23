import { css } from '@linaria/core';
import type { GroupFormatterProps } from '../types';

const groupCellContent = css`
  outline: none;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
`;

const groupCellTitle = css`
  font-size: 10px;
  position: absolute;
  top: -12px;
  left: 20px;
`;

const groupCellValue = css`
  font-size: 13px;
  position: absolute;
  top: 6px;
  left: 20px;
`;

const groupCellContentClassname = `rdg-group-cell-content ${groupCellContent}`;


export function kontenbaseGroupFormatter<R, SR>({
  groupKey,
  isExpanded,
  toggleGroup,
  groupColumn,
}: GroupFormatterProps<R, SR>) {

  function handleKeyDown({ key }: React.KeyboardEvent<HTMLSpanElement>) {
    if (key === 'Enter') {
      toggleGroup();
    }
  }

  const d = isExpanded ? 'M0.71 1.71L3.3 4.3C3.69 4.69 4.32 4.69 4.71 4.3L7.3 1.71C7.93 1.08 7.48 0 6.59 0H1.41C0.52 0 0.08 1.08 0.71 1.71Z' : 'M7.29 3.29L4.7 0.7C4.31 0.31 3.68 0.31 3.29 0.7L0.7 3.29C0.0699998 3.92 0.52 5 1.41 5L6.59 5C7.48 5 7.92 3.92 7.29 3.29Z';

  console.log("===", groupKey)
  return (
    <div
      className={groupCellContentClassname}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >

      <svg 
        onClick={toggleGroup}
        width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden
        style={{
          marginRight: 12,
          cursor: 'pointer',
        }}  
      >
        <path d={d} fill="currentColor" />
      </svg>
        <span className={groupCellTitle}>
          {groupColumn?.name}
        </span>
        <span className={groupCellValue}>
          {groupKey === "null" ? "(Empty)" : groupKey}
        </span>
    </div>
  );
}
