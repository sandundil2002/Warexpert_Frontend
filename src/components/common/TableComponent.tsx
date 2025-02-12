import React, { useState } from "react";
import { Edit, Trash2 } from 'lucide-react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    IconButton
} from "@mui/material";

// Generic interface for table items
export interface TableItem {
    id: string;
    [key: string]: string;
}

export interface ColumnDef<T extends TableItem> {
    id: keyof T | 'actions';
    label: string;
    align?: 'left' | 'right' | 'center';
    render?: (item: T) => React.ReactNode;
}

export interface GenericTableProps<T extends TableItem> {
    data: T[];
    columns: ColumnDef<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (itemId: string) => void;
    rowsPerPage?: number;
    enableSelection?: boolean;
    onRowSelect?: (item: T | null) => void;
    customActions?: (item: T) => React.ReactNode;
}

export const TableComponent = <T extends TableItem>({data, columns, onEdit, onDelete, rowsPerPage = 5, enableSelection = true, onRowSelect, customActions}: GenericTableProps<T>) => {
    const [page] = useState(0);
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const isSelected = (id: string) => selectedRow === id;

    const handleRowClick = (item: T) => {
        if (!enableSelection) return;

        const newSelectedId = item.id === selectedRow ? null : item.id;
        setSelectedRow(newSelectedId);
        onRowSelect?.(newSelectedId ? item : null);
    };

    const renderCell = (item: T, column: ColumnDef<T>) => {
        if (column.id === 'actions') {
            return (
                <TableCell key={column.id.toString()} align={column.align || 'center'}>
                    {customActions ? (
                        customActions(item)
                    ) : (
                        <>
                            {onEdit && (
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(item);
                                    }}
                                    className="text-green-800 hover:text-green-500"
                                >
                                    <Edit className="h-4 w-4" />
                                </IconButton>
                            )}
                            {onDelete && (
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item.id);
                                    }}
                                    className="text-red-600 hover:text-red-800 ml-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </IconButton>
                            )}
                        </>
                    )}
                </TableCell>
            );
        }

        const cellValue = item[column.id] ?? "N/A";

        if (column.render) {
            const renderedValue = column.render(item);
            return (
                <TableCell key={column.id.toString()} align={column.align}>
                    {renderedValue ?? "N/A"}
                </TableCell>
            );
        }

        return (
            <TableCell key={column.id.toString()} align={column.align}>
                {cellValue}
            </TableCell>
        );
    };

    return (
        <Box className="p-4">
            <Box className="overflow-x-auto">
                <TableContainer component={Paper} className="max-h-[440px]">
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id.toString()}
                                        align={column.align}
                                        className="font-semibold"
                                    >
                                        <Tooltip title={`Sort by ${column.label}`}>
                                            <TableSortLabel>
                                                {column.label}
                                            </TableSortLabel>
                                        </Tooltip>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item) => (
                                    <TableRow
                                        hover
                                        key={item.id}
                                        onClick={() => handleRowClick(item)}
                                        selected={isSelected(item.id)}
                                        className={`
                                            cursor-pointer
                                            ${isSelected(item.id) ? 'bg-blue-100' : ''}
                                        `}
                                    >
                                        {columns.map((column) => renderCell(item, column))}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};