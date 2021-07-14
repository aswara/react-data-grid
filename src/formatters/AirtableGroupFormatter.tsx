import { css } from '@linaria/core';
import type { GroupFormatterProps } from '../types';
import { useFocusRef } from '../hooks/useFocusRef';

const groupCellContent = css`
  outline: none;
`;

const groupCellContentClassname = `rdg-group-cell-content ${groupCellContent}`;

const caret = css`
  margin-left: 4px;
  stroke: currentColor;
  stroke-width: 1.5px;
  fill: transparent;
  vertical-align: middle;

  > path {
    transition: d 0.1s;
  }
`;

const caretClassname = `rdg-caret ${caret}`;

export function AirtableGroupFormatter<R, SR>({
  groupKey,
  isExpanded,
  isCellSelected,
  toggleGroup
}: GroupFormatterProps<R, SR>) {
  const cellRef = useFocusRef<HTMLSpanElement>(isCellSelected);

  function handleKeyDown({ key }: React.KeyboardEvent<HTMLSpanElement>) {
    if (key === 'Enter') {
      toggleGroup();
    }
  }

  const d = isExpanded ? 'M1 1 L 7 7 L 13 1' : 'M1 7 L 7 1 L 13 7';

  return (
    <span
      ref={cellRef}
      className={groupCellContentClassname}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <svg 
        onClick={toggleGroup}
        viewBox="0 0 14 8" width="14" height="8" className={caretClassname} aria-hidden
        style={{
          marginRight: 12,
          cursor: 'pointer'
        }}  
      >
        <path d={d} />
      </svg>
      {groupKey}
    </span>
  );
}
