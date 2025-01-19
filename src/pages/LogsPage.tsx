import React, {useMemo, useState} from 'react';
import {Logs} from "../components/interfaces/logs.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {addLog, deleteLog, updateLog} from "../slices/LogSlice.tsx";

interface RootState {
    log: Logs[];
}

export const LogsPage: React.FC = () => {
    const logs = useSelector((state: RootState) => state.log);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<Logs | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const fields = [
        {
            id: 'logId',
            label: 'Log ID',
            type: 'text' as const,
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'warehouse',
            label: 'Warehouse',
            type: 'text' as const,
            required: true
        },
        {
            id: 'inventory',
            label: 'Inventory',
            type: 'text' as const,
            required: true
        },
        {
            id: 'timestamp',
            label: 'Timestamp',
            type: 'text' as const,
            required: true
        },
        {
            id: 'action',
            label: 'Action',
            type: 'text' as const,
            required: true
        },
        {
            id: 'user',
            label: 'User',
            type: 'text' as const,
            required: true
        }
    ];

    const columns: ColumnDef<Logs>[] = [
        {id: 'id', label: 'ID'},
        {id: 'warehouse', label: 'Warehouse'},
        {id: 'inventory', label: 'Inventory'},
        {id: 'timestamp', label: 'Timestamp'},
        {id: 'action', label: 'Action'},
        {id: 'user', label: 'User'},
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    const handleOpen = () => {
        setMode('create');
        setSelectedLog(null);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedLog(null);
    }

    const handleEdit = (logs: Logs) => {
        setMode('edit');
        setSelectedLog(logs);
        setOpen(true);
    }

    const handleDelete = async (logId: string) => {
        dispatch(deleteLog(logId));
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newLog: Logs = {
                id: `LOG-${logs.length + 1}`,
                warehouse: data.warehouse,
                inventory: data.inventory,
                timestamp: data.timestamp,
                action: data.action,
                user: data.user
            };
            dispatch(addLog(newLog));
        } else {
            const updatedLog: Logs = {
                id: data.logId,
                warehouse: data.warehouse,
                inventory: data.inventory,
                timestamp: data.timestamp,
                action: data.action,
                user: data.user
            };
            dispatch(updateLog(updatedLog));
        }
        handleClose();
    }

    const displayLogs = useMemo(() => {
        if (!searchQuery) {
            return logs;
        }
        return logs.filter((log) =>
            log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.warehouse.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [logs, searchQuery]);

    const handleLogSelect = (log: Logs | null) => {
        if (log) {
            setSearchQuery(log.id);
        } else {
            setSearchQuery('');
        }
    }

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Logs Section" addNew={handleOpen} />

                <SearchBarComponent<Logs>
                    title="Search Logs By ID"
                    data={logs}
                    onSelect={handleLogSelect}
                />

                <TableComponent
                    columns={columns}
                    data={displayLogs}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableSelection={true}
                />

                <PopupModalComponent
                    title="Logs"
                    open={open}
                    handleClose={handleClose}
                    fields={fields}
                    onSubmit={handleSubmit}
                    initialData={mode === 'edit' ? {
                        logId: selectedLog?.id,
                        warehouse: selectedLog?.warehouse,
                        inventory: selectedLog?.inventory,
                        timestamp: selectedLog?.timestamp,
                        action: selectedLog?.action,
                        user: selectedLog?.user
                    } : undefined}
                    mode={mode}
                />
            </div>
        </>
    );
};