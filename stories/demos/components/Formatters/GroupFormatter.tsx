
const groupCellContent = {
  outline: "none",
  display: "flex",
  alignItems: "center",
  position: "relative",
  height: "100%",
  borderLeft: "1px solid var(--border-color)",
  paddingLeft: "10px",
  marginLeft: "-0.5px",
}

const groupCellTitle = {
  fontSize: "10px",
  position: "absolute",
  top: "-12px",
  left: "30px",
}

const groupCellValue = {
  fontSize: "13px",
  position: "absolute",
  top: "6px",
  left: "30px",
}

const groupCellContentClassname = `rdg-group-cell-content`;


export default function GroupFormatter({
  groupKey,
  isExpanded,
  toggleGroup,
  groupColumn,
  rowColumn,
  childRows
}) {

  function handleKeyDown({ key }) {
    if (key === 'Enter') {
      toggleGroup();
    }
  }

  const type = groupColumn?.type;
  const d = isExpanded ? 'M0.71 1.71L3.3 4.3C3.69 4.69 4.32 4.69 4.71 4.3L7.3 1.71C7.93 1.08 7.48 0 6.59 0H1.41C0.52 0 0.08 1.08 0.71 1.71Z' : 'M7.29 3.29L4.7 0.7C4.31 0.31 3.68 0.31 3.29 0.7L0.7 3.29C0.0699998 3.92 0.52 5 1.41 5L6.59 5C7.48 5 7.92 3.92 7.29 3.29Z';

  let content = groupKey === "null" ? "(Empty)" : groupKey;
  const value = childRows?.[0]?.[groupColumn?.key]
  if (type === "singleSelect") {
    content = <Chip label={value?.label} />
  }

  return (
    <div
      className={groupCellContentClassname}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      style={groupCellContent}
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
        {/* <span style={groupCellTitle}>
          {groupColumn?.name}
        </span>
        <span style={groupCellValue}>
          {content}
        </span> */}
    </div>
  );
}
