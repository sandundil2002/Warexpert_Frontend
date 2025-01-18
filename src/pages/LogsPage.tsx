import React, {useState} from 'react';
import {Logs} from "../components/interfaces/logs.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";

const sampleData: Logs[] = [
    {
        id: "LOG001",
        warehouse: "Main WarehouseModel",
        inventory: "Laptop",
        timestamp: "2021-01-01",
        action: "Create",
        user: "Admin"
    },
    {
        id: "LOG002",
        warehouse: "South Branch",
        inventory: "Chair",
        timestamp: "2021-01-02",
        action: "Update",
        user: "Admin"
    }
];

export const LogsPage: React.FC = () => {

    const [logs, setLogs] = useState<Logs[]>(sampleData);
    const [open, setOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState<Logs | null>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

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
        const updatedLogs = logs.filter(logs => logs.id !== logId);
        setLogs(updatedLogs);
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            setLogs([...logs, {
                id: `LOG00${logs.length + 1}`,
                warehouse: data.warehouse,
                inventory: data.inventory,
                timestamp: data.timestamp,
                action: data.action,
                user: data.user
            }]);
        } else {
            setLogs(logs.map(logs => {
                if (logs.id === selectedLog?.id) {
                    return {
                        ...logs,
                        warehouse: data.warehouse,
                        inventory: data.inventory,
                        timestamp: data.timestamp,
                        action: data.action,
                        user: data.user
                    };
                }
                return logs;
            }));
        }
        handleClose();
    }

    const columns: ColumnDef<Logs>[] = [
        {id: 'id', label: 'ID'},
        {id: 'warehouse', label: 'Warehouse'},
        {id: 'inventory', label: 'Inventory'},
        {id: 'timestamp', label: 'Timestamp'},
        {id: 'action', label: 'Action'},
        {id: 'user', label: 'User'},
        { id: 'actions', label: 'Actions', align: 'center' }
    ];

    return (
        <>
            <div className="p-4 space-y-4">
                <TitleComponent title="Logs Section" addNew={handleOpen} />
                <SearchBarComponent title="Search Logs By ID" />
                <TableComponent
                    columns={columns}
                    data={logs}
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