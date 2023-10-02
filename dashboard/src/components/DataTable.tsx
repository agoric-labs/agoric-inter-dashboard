import {
  SortingState,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { formatPercent } from '@/utils';

export const renderUSD = (val: string) => {
  const amount = parseFloat(val);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  return <div className="text-right font-medium">{formatted}</div>;
};

export const renderNumber = (val: string) => {
  const v = parseFloat(val);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  }).format(v);

  return <div className="text-right font-medium">{formatted}</div>;
};

export const renderPercent = (val: string) => <div className="text-right font-medium">{formatPercent(val)}</div>;

export const numberHeader = (t: string) => () => <div className="text-right">{t}</div>;

export type DataColumn<T> = ColumnDef<T> & { type: 'number' | 'usd' | 'percent' | 'text' };

export function DataTable<T>({ data, columns }: { data: T[]; columns: DataColumn<T>[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const patchedColumns: ColumnDef<T>[] = columns.map((c) => {
    const { type, ...col } = c;

    // @ts-ignore
    if (type !== 'text' && typeof col.header === 'string') {
      col.header = numberHeader(col.header);
    }

    // TODO: fix it
    // @ts-ignore
    if (typeof col.accessorKey === 'string' && !col.cell) {
      if (type === 'usd') {
        // @ts-ignore
        col.cell = ({ row }) => renderUSD(row.getValue(col.accessorKey));
      }

      if (type === 'percent') {
        // @ts-ignore
        col.cell = ({ row }) => renderPercent(row.getValue(col.accessorKey));
      }

      if (type === 'number') {
        // @ts-ignore
        col.cell = ({ row }) => renderNumber(row.getValue(col.accessorKey));
      }
    }

    const oldCol = col.header;

    col.header = ({ column }) => (
      <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-left w-full" type="button">
        {typeof oldCol === 'string' ? oldCol : React.createElement(oldCol as any, { column })}
      </button>
    );

    return col;
  });

  const table = useReactTable({
    data,
    columns: patchedColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
