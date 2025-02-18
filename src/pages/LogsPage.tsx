import React, {useEffect, useMemo, useState} from 'react';
import {Logs} from "../model/logs.ts";
import {ColumnDef, TableComponent} from "../components/common/TableComponent.tsx";
import {TitleComponent} from "../components/common/TitleComponent.tsx";
import {SearchBarComponent} from "../components/common/SearchBarComponent.tsx";
import {PopupModalComponent} from "../components/popup/PopupModalComponent.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store.ts";
import {addLog, getLogs} from "../reducers/log-slice.ts";
import {getWarehouses} from "../reducers/warehouse-slice.ts";
import {getEmployees} from "../reducers/employee-slice.ts";
import {getInventory} from "../reducers/inventory-slice.ts";
import {Warehouse} from "../model/warehouse.ts";
import {Employee} from "../model/employee.ts";
import {Inventory} from "../model/inventory.ts";

interface Field {
    id: string;
    label: string;
    type: "text" | "select";
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    options?: { value: string; label: string }[];
}

export const LogsPage: React.FC = () => {
    const logs = useSelector((state: RootState) => state.log);
    const staffs = useSelector((state: RootState) => state.employee);
    const warehouses = useSelector((state: RootState) => state.warehouse);
    const inventories = useSelector((state: RootState) => state.inventory);
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        if (!logs.length) {
            dispatch(getLogs());
        }
    }, [dispatch, logs.length]);

    useEffect(() => {
        if (!staffs.length) {
            dispatch(getEmployees());
        }
    }, [dispatch, staffs.length]);

    useEffect(() => {
        if (!warehouses.length) {
            dispatch(getWarehouses());
        }
    }, [dispatch, warehouses.length]);

    useEffect(() => {
        if (!inventories.length) {
            dispatch(getInventory());
        }
    }, [dispatch, inventories.length]);

    const fields: Field[] = [
        {
            id: 'logId',
            label: 'Log ID',
            type: 'text',
            placeholder: 'Auto-generated',
            readOnly: true,
        },
        {
            id: 'type',
            label: 'Operation Type',
            type: 'select',
            required: true,
            options: [
                { value: 'RECEIVE', label: 'Receive Goods' },
                { value: 'SHIP', label: 'Ship Goods' },
                { value: 'TRANSFER_IN', label: 'Transfer In (Internal)' },
                { value: 'TRANSFER_OUT', label: 'Transfer Out (Internal)' },
                { value: 'RETURN', label: 'Return Goods' },
                { value: 'ADJUSTMENT_IN', label: 'Inventory Adjustment (In)' },
                { value: 'ADJUSTMENT_OUT', label: 'Inventory Adjustment (Out)' },
                { value: 'INSPECTION', label: 'Inspection/Quality Check' },
                { value: 'REPAIR', label: 'Repair/Maintenance' },
                { value: 'DISPOSAL', label: 'Dispose Goods' },
                { value: 'OTHER', label: 'Other' }
            ]
        },
        {
            id: 'incidents',
            label: 'Incidents',
            type: 'text',
            required: true
        },
        {
            id: 'staffId',
            label: 'User',
            type: 'select',
            required: true,
            options: staffs.map((staffs: Employee) => ({
                value: staffs.id,
                label: staffs.name
            })),
        },
        {
            id: 'warehouseId',
            label: 'Warehouse Name',
            type: 'select',
            required: true,
            options: warehouses.map((warehouse: Warehouse) => ({
                value: warehouse.id,
                label: warehouse.name,
            })),
        },
        {
            id: 'inventoryId',
            label: 'Inventory',
            type: 'select',
            required: true,
            options: inventories.map((inventory: Inventory) => ({
                value: inventory.id,
                label: inventory.name,
            })),
        }
    ];

    const columns: ColumnDef<Logs>[] = [
        {id: 'id', label: 'ID', align: 'center' },
        {id: 'type', label: 'Operation Type', align: 'center' },
        {id: 'incidents', label: 'Incidents', align: 'center' },
        {id: 'staffId', label: 'User ID', align: 'center' },
        {id: 'warehouseId', label: 'Warehouse', align: 'center' },
        {id: 'inventoryId', label: 'Inventory', align: 'center' },
    ];

    const handleOpen = () => {
        setMode('create');
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = async (data: Record<string, any>) => {
        if (mode === 'create') {
            const newLog: Logs = {
                id: `LOG-${logs.length + 1}`,
                type: data.tType,
                incidents: data.incidents,
                staffId: data.staffId,
                warehouseId: data.warehouseId,
                inventoryId: data.inventoryId
            };
            await dispatch(addLog(newLog));
        }
        handleClose();
    }

    const displayLogs = useMemo(() => {
        if (!searchQuery) return logs;

        return logs.filter(
            (log) =>
            log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.inventoryId.toLowerCase().includes(searchQuery.toLowerCase())
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
                    data={displayLogs}
                    columns={columns}
                    enableSelection={true}
                />

                <PopupModalComponent
                    title="Logs"
                    open={open}
                    handleClose={handleClose}
                    fields={fields}
                    onSubmit={handleSubmit}
                    mode={mode}
                />
            </div>
        </>
    );
};