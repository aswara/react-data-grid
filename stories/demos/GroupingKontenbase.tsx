import { useState } from 'react';
import { groupBy as rowGrouper } from 'lodash';
import faker from 'faker';
import { css } from '@linaria/core';

import DataGrid, { SelectColumn } from '../../src';
import type { Column } from '../../src';
import data from './GroupData';

const groupingClassname = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;

  > .rdg {
    flex: 1;
  }
`;

const optionsClassname = css`
  display: flex;
  gap: 8px;
  text-transform: capitalize;
`;

interface Row {
  key: number;
  Name: string;
  rating: number;
  sport: string;
  athlete: string;
  gold: number;
  silver: number;
  bronze: number;
}

const sports = [
  'Swimming',
  'Gymnastics',
  'Speed Skating',
  'Cross Country Skiing',
  'Short-Track Speed Skating',
  'Diving',
  'Cycling',
  'Biathlon',
  'Alpine Skiing',
  'Ski Jumping',
  'Nordic Combined',
  'Athletics',
  'Table Tennis',
  'Tennis',
  'Synchronized Swimming',
  'Shooting',
  'Rowing',
  'Fencing',
  'Equestrian',
  'Canoeing',
  'Bobsleigh',
  'Badminton',
  'Archery',
  'Wrestling',
  'Weightlifting',
  'Waterpolo',
  'Wrestling',
  'Weightlifting'
];

const columns: readonly Column<Row>[] = [
  // {
  //   key: 'GROUP',
  //   maxWidth: 60,
  //   name: '',
  //   frozen: true,
  // },
  // {
  //   key: 'ROW',
  //   maxWidth: 60,
  //   name: '',
  //   frozen: true,
  // },
  {
    key: 'Name',
    name: 'Country',
    frozen: true,
    width: 200
  },
  {
    key: 'rating',
    name: 'Year',
    width: 200
  },
  {
    key: 'sport',
    name: 'Sport',
    width: 200
  },
  {
    key: 'athlete',
    name: 'Athlete',
    width: 200
  },
  {
    key: 'gold',
    name: 'Gold',
    // groupFormatter({ childRows }) {
    //   return <>{childRows.reduce((prev, { gold }) => prev + gold, 0)}</>;
    // },
    width: 200
  },
  {
    key: 'silver',
    name: 'Silver',
    // groupFormatter({ childRows }) {
    //   return <>{childRows.reduce((prev, { silver }) => prev + silver, 0)}</>;
    // },
    width: 200
  },
  {
    key: 'bronze',
    name: 'Bronze',
    // groupFormatter({ childRows }) {
    //   return <>{childRows.reduce((prev, { silver }) => prev + silver, 0)}</>;
    // },
    width: 200
  },
  {
    key: 'total',
    name: 'Total',
    formatter({ row }) {
      return <>{row.gold + row.silver + row.bronze}</>;
    },
    // groupFormatter({ childRows }) {
    //   return <>{childRows.reduce((prev, row) => prev + row.gold + row.silver + row.bronze, 0)}</>;
    // }
  }
];

function rowKeyGetter(row: Row) {
  return row.key;
}

function createRows(): readonly Row[] {
  const rows: Row[] = [];
  for (let i = 1; i < 10000; i++) {
    rows.push({
      ROW: '2',
      key: i,
    });
  }

  return rows;
}

const options = ['Name', 'rating', 'sport', 'athlete'] as const;

export function GroupingKontenbase() {
  const [rows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(() => new Set());
  const [selectedOptions, setSelectedOptions] = useState<readonly string[]>([
    options[0],
    options[1]
  ]);
  const [expandedGroupIds, setExpandedGroupIds] = useState<ReadonlySet<unknown>>(
    () => new Set<unknown>([])
  );

  function toggleOption(option: string, enabled: boolean) {
    const index = selectedOptions.indexOf(option);
    if (enabled) {
      if (index === -1) {
        setSelectedOptions((options) => [...options, option]);
      }
    } else if (index !== -1) {
      setSelectedOptions((options) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        return newOptions;
      });
    }
    setExpandedGroupIds(new Set());
  }

  function rowHeight(arg) {
    // should be based on the content of the row
    if(arg.type === 'GROUP') {
      return 50
    }

    if(arg.row.id === 'DIVIDER') {
      return 26
    }

    return 36;
  }

  // columns[0].maxWidth = selectedOptions.length * 16

  const groupRows = [];

  const mapping = (records) => {
    records.forEach(element => {
      if(element.records) {
        groupRows.push(...element.records)
      }
    });
  }

  mapping(data)

  return (
    <div className={groupingClassname}>
      <b>Group by columns:</b>
      <div className={optionsClassname}>
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(event) => toggleOption(option, event.target.checked)}
            />{' '}
            {option}
          </label>
        ))}
      </div>

      
      <DataGrid
        columns={columns}
        rows={groupRows}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        groupBy={selectedOptions}
        rowGrouper={rowGrouper}
        expandedGroupIds={expandedGroupIds}
        onExpandedGroupIdsChange={setExpandedGroupIds}
        defaultColumnOptions={{ resizable: true }}
        rowHeight={rowHeight}
        enableVirtualization
        theme="kontenbase"
      />
    </div>
  );
}



GroupingKontenbase.storyName = 'GroupingKontenbase';
