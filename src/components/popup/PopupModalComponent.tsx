import * as React from 'react';
import { CloudUploadIcon, X } from 'lucide-react';
import {
    Button,
    FormControl,
    InputLabel,
    Modal,
    Select,
    TextField,
    useTheme
} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';

interface ModalField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'gps' | 'number' | 'file' | 'select' | 'time' | 'date';
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    options?: Array<{ value: string; label: string }>;
}

interface PopupModal {
    open: boolean;
    handleClose: () => void;
    title: string;
    fields: ModalField[];
    onSubmit: (data: Record<string, any>) => void;
    initialData?: Record<string, any>;
    mode: 'create' | 'edit';
}

export const PopupModalComponent: React.FC<PopupModal> = ({open, handleClose, title, fields, onSubmit, initialData = {}, mode}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [hasOpened, setHasOpened] = React.useState(false);
    const [formValues, setFormValues] = React.useState<Record<string, any>>({});

    React.useEffect(() => {
        if (open && !hasOpened) {
            if (mode === 'edit' && initialData) {
                setFormValues(initialData);
            } else {
                setFormValues({});
            }
            setHasOpened(true);
        }

        if (!open) {
            setHasOpened(false);
        }
    }, [open, mode, initialData, hasOpened]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data: Record<string, any> = { ...formValues };

        fields.forEach(field => {
            if (field.type === 'file') {
                const file = formData.get(field.id) as File;
                if (file && file.name !== '') {
                    data[field.id] = file;
                }
            } else {
                const value = formData.get(field.id);
                if (value !== null) {
                    data[field.id] = value;
                }
            }
        });

        onSubmit(data);
        handleClose();
    };

    const handleInputChange = (fieldId: string, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const groupedFields = fields.reduce((acc: ModalField[][], field, index) => {
        const rowIndex = Math.floor(index / 2);
        if (!acc[rowIndex]) {
            acc[rowIndex] = [];
        }
        acc[rowIndex].push(field);
        return acc;
    }, []);

    if (!open) return null;

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="overflow-auto bg-opacity-50 flex items-center justify-center">
                <div className={`top-40 rounded-lg w-full max-w-md p-6 absolute shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                            {mode === 'create' ? `Add New ${title}` : `Edit ${title}`}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                        >
                            <X size={30} />
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit}>
                        {groupedFields.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-4 mb-10">
                                {row.map((field) => (
                                    <div key={field.id} className="w-1/2">
                                        {field.type === 'file' ? (
                                            <Button
                                                component="label"
                                                variant="contained"
                                                startIcon={<CloudUploadIcon />}
                                                className="mt-2"
                                                sx={{
                                                    backgroundColor: '#3b82f6',
                                                    '&:hover': {
                                                        backgroundColor: '#2563eb'
                                                    }
                                                }}
                                            >
                                                {field.label}
                                                <input
                                                    type="file"
                                                    hidden
                                                    name={field.id}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            handleInputChange(field.id, file);
                                                        }
                                                    }}
                                                />
                                            </Button>
                                        ) : field.type === 'select' ? (
                                            <FormControl variant="outlined" sx={{ minWidth: 195 }}>
                                                <InputLabel>{field.label}</InputLabel>
                                                <Select
                                                    name={field.id}
                                                    value={formValues[field.id] || ''}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    label={field.label}
                                                    sx={{
                                                        backgroundColor: isDarkMode ? 'rgb(30 41 59)' : 'white',
                                                        color: isDarkMode ? 'rgb(226 232 240)' : 'inherit',
                                                    }}
                                                >
                                                    {field.options?.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <TextField
                                                name={field.id}
                                                type={field.type}
                                                label={field.label}
                                                placeholder={field.placeholder}
                                                value={formValues[field.id] || ''}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                variant="outlined"
                                                required={field.required}
                                                InputProps={{
                                                    readOnly: field.readOnly,
                                                }}
                                                sx={{
                                                    backgroundColor: isDarkMode ? 'rgb(30 41 59)' : 'white',
                                                    '& .MuiInputLabel-root': {
                                                        color: isDarkMode ? 'rgb(226 232 240)' : 'inherit'
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        color: isDarkMode ? 'rgb(226 232 240)' : 'inherit'
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isDarkMode
                                        ? 'text-slate-200 bg-slate-700 hover:bg-slate-600'
                                        : 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                                }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                            >
                                {mode === 'create' ? 'Create' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};