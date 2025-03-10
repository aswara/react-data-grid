import type { ReactElement } from 'react';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface Column<TRow, TSummaryRow = unknown> {
  /** The name of the column. By default it will be displayed in the header cell */
  readonly name: string | ReactElement;
  /** A unique key to distinguish each column */
  readonly key: string;
  /** Column width. If not specified, it will be determined automatically based on grid width and specified widths of other columns */
  readonly width?: number | string | null;
  /** Minimum column width in px. */
  readonly minWidth?: number | null;
  /** Maximum column width in px. */
  readonly maxWidth?: number | null;
  readonly cellClass?: string | ((row: TRow) => string | undefined | null) | null;
  readonly headerCellClass?: string | null;
  readonly summaryCellClass?: string | ((row: TSummaryRow) => string) | null;
  /** Formatter to be used to render the cell content */
  readonly formatter?: React.ComponentType<FormatterProps<TRow, TSummaryRow>> | null;
  /** Formatter to be used to render the summary cell content */
  readonly summaryFormatter?: React.ComponentType<SummaryFormatterProps<TSummaryRow, TRow>> | null;
  /** Formatter to be used to render the group cell content */
  readonly groupFormatter?: React.ComponentType<GroupFormatterProps<TRow, TSummaryRow>> | null;
  /** Enables cell editing. If set and no editor property specified, then a textinput will be used as the cell editor */
  readonly editable?: boolean | ((row: TRow) => boolean) | null;
  readonly colSpan?: ((args: ColSpanArgs<TRow, TSummaryRow>) => number | undefined | null) | null;
  /** Determines whether column is frozen or not */
  readonly frozen?: boolean | null;
  /** Enable resizing of a column */
  readonly resizable?: boolean | null;
  /** Enable sorting of a column */
  readonly sortable?: boolean | null;
  /** Sets the column sort order to be descending instead of ascending the first time the column is sorted */
  readonly sortDescendingFirst?: boolean | null;
  /** Editor to be rendered when cell of column is being edited. If set, then the column is automatically set to be editable */
  readonly editor?: React.ComponentType<EditorProps<TRow, TSummaryRow>> | null;
  readonly editorOptions?: {
    /** @default false */
    readonly createPortal?: boolean | null;
    /** @default false */
    readonly editOnClick?: boolean | null;
    /** Prevent default to cancel editing */
    readonly onCellKeyDown?: ((event: React.KeyboardEvent<HTMLDivElement>) => void) | null;
    /** Control the default cell navigation behavior while the editor is open */
    readonly onNavigation?: ((event: React.KeyboardEvent<HTMLDivElement>) => boolean) | null;
  } | null;
  /** Header renderer for each header cell */
  readonly headerRenderer?: React.ComponentType<HeaderRendererProps<TRow, TSummaryRow>> | null;
}

export interface CalculatedColumn<TRow, TSummaryRow = unknown> extends Column<TRow, TSummaryRow> {
  readonly idx: number;
  readonly resizable: boolean;
  readonly sortable: boolean;
  readonly frozen: boolean;
  readonly isLastFrozenColumn: boolean;
  readonly rowGroup: boolean;
  readonly formatter: React.ComponentType<FormatterProps<TRow, TSummaryRow>>;
}

export interface Position {
  readonly idx: number;
  readonly rowIdx: number;
}

export interface FormatterProps<TRow, TSummaryRow = unknown> {
  rowIdx: number;
  column: CalculatedColumn<TRow, TSummaryRow>;
  row: TRow;
  isCellSelected: boolean;
  onRowChange: (row: TRow) => void;
}

export interface SummaryFormatterProps<TSummaryRow, TRow = unknown> {
  column: CalculatedColumn<TRow, TSummaryRow>;
  row: TSummaryRow;
}

export interface GroupFormatterProps<TRow, TSummaryRow = unknown> {
  rowIdx: number;
  groupKey: unknown;
  column: CalculatedColumn<TRow, TSummaryRow>;
  childRows: readonly TRow[];
  isExpanded: boolean;
  isCellSelected: boolean;
  toggleGroup: () => void;
}

interface SharedEditorProps<TRow> {
  row: TRow;
  editorPortalTarget: Element;
  onRowChange: (row: TRow, commitChanges?: boolean) => void;
  onClose: (commitChanges?: boolean) => void;
}

export interface EditorProps<TRow, TSummaryRow = unknown> extends SharedEditorProps<TRow> {
  rowIdx: number;
  column: CalculatedColumn<TRow, TSummaryRow>;
}

export interface HeaderRendererProps<TRow, TSummaryRow = unknown> {
  column: CalculatedColumn<TRow, TSummaryRow>;
  sortDirection: SortDirection | undefined;
  priority: number | undefined;
  onSort: (ctrlClick: boolean) => void;
  allRowsSelected: boolean;
  onAllRowsSelectionChange: (checked: boolean) => void;
}

interface SelectedCellPropsBase {
  idx: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export interface EditCellProps<TRow> extends SelectedCellPropsBase {
  mode: 'EDIT';
  editorProps: SharedEditorProps<TRow>;
}

export interface SelectedCellProps extends SelectedCellPropsBase {
  mode: 'SELECT';
  onFocus: () => void;
  dragHandleProps:
    | Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onDoubleClick'>
    | undefined;
}

export type SelectCellFn = (position: Position, enableEditor?: boolean | null) => void;

export interface CellRendererProps<TRow, TSummaryRow>
  extends Pick<
      RowRendererProps<TRow, TSummaryRow>,
      'onRowChange' | 'onRowClick' | 'onRowDoubleClick' | 'selectCell'
    >,
    Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  rowIdx: number;
  column: CalculatedColumn<TRow, TSummaryRow>;
  colSpan: number | undefined;
  row: TRow;
  isCopied: boolean;
  isDraggedOver: boolean;
  isCellSelected: boolean;
  dragHandleProps:
    | Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onDoubleClick'>
    | undefined;
  theme: string | undefined;
}

export interface RowRendererProps<TRow, TSummaryRow = unknown>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  viewportColumns: readonly CalculatedColumn<TRow, TSummaryRow>[];
  row: TRow;
  rowIdx: number;
  copiedCellIdx: number | undefined;
  draggedOverCellIdx: number | undefined;
  lastFrozenColumnIndex: number;
  isRowSelected: boolean;
  top: number;
  height: number;
  selectedCellProps: EditCellProps<TRow> | SelectedCellProps | undefined;
  onRowChange: (rowIdx: number, row: TRow) => void;
  onRowClick: ((row: TRow, column: CalculatedColumn<TRow, TSummaryRow>) => void) | undefined | null;
  onRowDoubleClick:
    | ((row: TRow, column: CalculatedColumn<TRow, TSummaryRow>) => void)
    | undefined
    | null;
  rowClass: ((row: TRow) => string | undefined | null) | undefined | null;
  setDraggedOverRowIdx: ((overRowIdx: number) => void) | undefined;
  selectCell: SelectCellFn;
  theme: string | undefined;
}

export interface RowsChangeData<R, SR = unknown> {
  indexes: number[];
  column: CalculatedColumn<R, SR>;
}

export interface SelectRowEvent {
  rowIdx: number;
  checked: boolean;
  isShiftClick: boolean;
}

export interface FillEvent<TRow> {
  columnKey: string;
  sourceRow: TRow;
  targetRows: TRow[];
}

export interface PasteEvent<TRow> {
  sourceColumnKey: string;
  sourceRow: TRow;
  targetColumnKey: string;
  targetRow: TRow;
}

export interface GroupRow<TRow> {
  readonly childRows: readonly TRow[];
  readonly id: string;
  readonly parentId: unknown;
  readonly groupKey: unknown;
  readonly isExpanded: boolean;
  readonly level: number;
  readonly posInSet: number;
  readonly setSize: number;
  readonly startRowIndex: number;
}

export interface SortColumn {
  readonly columnKey: string;
  readonly direction: SortDirection;
}

export type CellNavigationMode = 'NONE' | 'CHANGE_ROW' | 'LOOP_OVER_ROW';
export type SortDirection = 'ASC' | 'DESC';

export type ColSpanArgs<R, SR> =
  | { type: 'HEADER' }
  | { type: 'ROW'; row: R }
  | { type: 'SUMMARY'; row: SR };

export type RowHeightArgs<R> = { type: 'ROW'; row: R } | { type: 'GROUP'; row: GroupRow<R> };
