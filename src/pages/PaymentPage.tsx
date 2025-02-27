import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {TextField, Button, Grid, Paper, Box, Select, MenuItem, FormControl, InputLabel, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,} from "@mui/material";
import {createPayment, getAllPayments} from "../reducers/payment-slice.ts";
import { getCustomers } from "../reducers/customer-slice.ts";
import { getInventory } from "../reducers/inventory-slice.ts";
import {CATEGORY_PRICES} from "../model/enums.ts";
import {toast} from "sonner";

interface Customer {
    id: string;
    name: string;
}

interface Inventory {
    id: string;
    name: string;
    category: string;
    customerId: string;
    quantity: number;
    status?: string;
}

interface PaymentItem {
    id: string;
    customer: { name: string };
    amount: number;
    status: string;
    inventoryItems: Array<{
        inventoryItemId: string;
        inventoryItem: {
            name: string;
            quantity: number;
        }
    }>;
}

export const PaymentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { payments, loading, error } = useSelector((state: RootState) => state.payment);
    const customers = useSelector((state: RootState) => state.customer);
    const inventory = useSelector((state: RootState) => state.inventory);

    const [customerId, setCustomerId] = useState("");
    const [inventoryItems, setInventoryItems] = useState<{ inventoryItemId: string; quantity: number }[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [filteredInventory, setFilteredInventory] = useState<Inventory[]>([]);

    useEffect(() => {
        dispatch(getAllPayments());
    }, [dispatch, refreshTrigger]);

    useEffect(() => {
        if (!customers.length) {
            dispatch(getCustomers());
        }
    }, [dispatch, customers.length]);

    useEffect(() => {
        if (!inventory.length) {
            dispatch(getInventory());
        }
    }, [dispatch, inventory.length]);

    // Filter inventory items based on selected customer
    useEffect(() => {
        if (customerId && inventory.length > 0) {

            const customerItems = inventory.filter(
                // @ts-ignore
                (item: Inventory) => item.customerId === customerId && item.quantity > 0
            );
            // @ts-ignore
            setFilteredInventory(customerItems);

            setInventoryItems([]);
        } else {
            setFilteredInventory([]);
        }
    }, [customerId, inventory]);

    const calculateTotalAmount = () => {
        let total = 0;

        inventoryItems.forEach((item) => {
            const selectedItem = inventory.find((inv) => inv.id === item.inventoryItemId);
            if (selectedItem) {
                const pricePerUnit = CATEGORY_PRICES[selectedItem.category] || 0;
                total += pricePerUnit * item.quantity;
            }
        });

        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount();
    }, [inventoryItems]);

    const handleAddItem = () => {
        setInventoryItems([...inventoryItems, { inventoryItemId: "", quantity: 1 }]);
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const updatedItems = [...inventoryItems];
        if (field === "inventoryItemId") {
            updatedItems[index].inventoryItemId = value as string;
        } else if (field === "quantity") {
            updatedItems[index].quantity = Number(value);
        }
        setInventoryItems(updatedItems);
    };

    const handleCustomerChange = (customerId: string) => {
        setCustomerId(customerId);
        setInventoryItems([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const paymentAction = dispatch(
                createPayment({
                    customerId,
                    inventoryItems,
                    totalAmount,
                })
            );

            toast.promise(paymentAction, {
                loading: "Pending payment...",
                success: () => {
                    setCustomerId("");
                    setInventoryItems([]);
                    setTotalAmount(0);
                    setRefreshTrigger(prev => prev + 1);
                    return "Payment successful";
                },
                error: "Insufficient inventory items quantity",
            });
        } catch (error) {
            console.error("Error during payment creation:", error);
        }
    };

    const hasInsufficientQuantity = (inventoryItemId: string, requestedQuantity: number) => {
        const item = inventory.find(inv => inv.id === inventoryItemId);
        // @ts-ignore
        return item && item.quantity < requestedQuantity;
    };

    return (
        <>
            <Box sx={{ mx: 2, color: "#ffffff" }}>
                <Box component="h1" sx={{ color: "primary.main", fontSize: "2.5rem", fontWeight: "bold", textAlign: "center", mb: 2 }}>
                    Payment Section
                </Box>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        color: "#ffffff",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Customer</InputLabel>
                            <Select
                                value={customerId}
                                label="Customer"
                                onChange={(e) => handleCustomerChange(e.target.value as string)}
                                sx={{ color: "#ffffff" }}
                            >
                                <MenuItem value="">
                                    <em>Select a customer</em>
                                </MenuItem>
                                {customers.map((customer: Customer) => (
                                    <MenuItem key={customer.id} value={customer.id}>
                                        {customer.name} ({customer.id})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {customerId && (
                            <>
                                <Box component="h6" sx={{ color: "primary.main", fontSize: "1.25rem", fontWeight: "bold", mt: 2, mb: 2 }}>
                                    Inventory Items
                                </Box>

                                {filteredInventory.length === 0 && customerId && (
                                    <Box sx={{ color: "#ff9800", mb: 2 }}>
                                        No available inventory items for this customer.
                                    </Box>
                                )}

                                {inventoryItems.map((item, index) => {
                                    const selectedItem = inventory.find((inv) => inv.id === item.inventoryItemId);
                                    const pricePerUnit = selectedItem ? CATEGORY_PRICES[selectedItem.category] || 0 : 0;
                                    const maxAvailable = selectedItem ? selectedItem.quantity : 0;
                                    const isInsufficient = hasInsufficientQuantity(item.inventoryItemId, item.quantity);

                                    return (
                                        <Grid container spacing={2} key={index} mb={2}>
                                            <Grid item xs={6}>
                                                <FormControl fullWidth required>
                                                    <InputLabel>Inventory Item</InputLabel>
                                                    <Select
                                                        value={item.inventoryItemId}
                                                        label="Inventory Item"
                                                        onChange={(e) =>
                                                            handleItemChange(index, "inventoryItemId", e.target.value)
                                                        }
                                                        sx={{ color: "#ffffff" }}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select an item</em>
                                                        </MenuItem>
                                                        {filteredInventory.map((inv: Inventory) => (
                                                            <MenuItem key={inv.id} value={inv.id}>
                                                                {inv.name} ({inv.category}) - Available: {inv.quantity}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Quantity"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                    required
                                                    inputProps={{ min: 1, max: maxAvailable }}
                                                    error={isInsufficient}
                                                    helperText={isInsufficient ? "Insufficient quantity available" : ""}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Box sx={{ color: isInsufficient ? "#ff4444" : "#ffffff" }}>
                                                    Price per unit: ${pricePerUnit.toFixed(2)} | Subtotal: $
                                                    {(pricePerUnit * item.quantity).toFixed(2)}
                                                     {/*@ts-ignore*/}
                                                    {maxAvailable > 0 && ` | Available: ${maxAvailable}`}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    );
                                })}

                                {customerId && filteredInventory.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddItem}
                                        sx={{ mb: 2 }}
                                        disabled={filteredInventory.length === 0}
                                    >
                                        Add Item
                                    </Button>
                                )}

                                <TextField
                                    fullWidth
                                    label="Total Amount"
                                    type="number"
                                    value={totalAmount.toFixed(2)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    margin="normal"
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading || inventoryItems.length === 0 || inventoryItems.some(item =>
                                        !item.inventoryItemId ||
                                        hasInsufficientQuantity(item.inventoryItemId, item.quantity)
                                    )}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: "#007bff",
                                        color: "#ffffff",
                                        "&:hover": { backgroundColor: "#0056b3" },
                                    }}
                                >
                                    {loading ? "loading..." : "Complete Payment"}
                                </Button>
                            </>
                        )}

                        {error && (
                            <Box
                                component="span"
                                sx={{
                                    mt: 2,
                                    color: "#ff4444",
                                    display: "block",
                                }}
                            >
                                {error}
                            </Box>
                        )}
                    </form>
                </Paper>
            </Box>
            <Box sx={{ p: 4 }}>
                <Box component="h2" sx={{ color: "primary.main", fontSize: "1.7rem", fontWeight: "bold", textAlign: "left", mb: 2 }}>
                    Payment Details
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Inventory Items</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(payments) && payments.length > 0 ? (
                                payments.map((payment: PaymentItem) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{payment.id}</TableCell>
                                        <TableCell>{payment.customer?.name || 'N/A'}</TableCell>
                                        <TableCell>${typeof payment.amount === 'number' ? payment.amount.toFixed(2) : '0.00'}</TableCell>
                                        <TableCell>{payment.status || 'Unknown'}</TableCell>
                                        <TableCell>
                                            {Array.isArray(payment.inventoryItems) ?
                                                payment.inventoryItems.map((item) => (
                                                    <div key={item.inventoryItemId}>
                                                        {item.inventoryItem?.name || 'Unknown'}
                                                        ({item.inventoryItem?.quantity || 0})
                                                    </div>
                                                ))
                                                : 'No items'
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No payment records found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};