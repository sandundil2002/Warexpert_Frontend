import * as React from 'react';
import {CloudUploadIcon, X} from 'lucide-react';
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
    type: 'text' | 'gps' | 'number' | 'file' | 'select';
    placeholder?: string;
}

interface PopupModal {
    open: boolean;
    handleClose: () => void;
    title: string;
    fields: ModalField[];
    onSubmit: (data: Record<string, string>) => void;
}

export const InputPopupModalComponent: React.FC<PopupModal> = ({open, handleClose, title, fields, onSubmit}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data: Record<string, string> = {};
        fields.forEach(field => {
            data[field.id] = formData.get(field.id) as string;
        });
        onSubmit(data);
        handleClose();
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
        <>
            <Modal open={open} onClose={handleClose}>
                <div className="overflow-auto bg-opacity-50 flex items-center justify-center">
                    <div className={`top-40 rounded-lg w-full max-w-md p-6 absolute shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-5">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                {title}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                            >
                                <X size={30}/>
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit}>
                            {groupedFields.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex gap-4 mb-10">
                                    {row.map((field) => (
                                        <div key={field.id} className="w-1/2">
                                            {field.type === 'file' ? (
                                                <Button
                                                    className="mt-2"
                                                    component="label"
                                                    role={undefined}
                                                    variant="contained"
                                                    tabIndex={-1}
                                                    startIcon={<CloudUploadIcon />}
                                                    sx={{
                                                        backgroundColor: '#3b82f6',
                                                        '&:hover': {
                                                            backgroundColor: '#2563eb'
                                                        }
                                                    }}
                                                >
                                                    {field.label}
                                                </Button>
                                            ) : field.type === 'select' ? (
                                                <FormControl variant="outlined" sx={{ minWidth: 195 }}>
                                                    <InputLabel>{field.label}</InputLabel>
                                                    <Select
                                                        labelId={field.label}
                                                        id={field.id}
                                                        value={field.id}
                                                        label={field.label}
                                                        sx={{
                                                            backgroundColor: isDarkMode ? 'rgb(30 41 59)' : 'white',
                                                            color: isDarkMode ? 'rgb(226 232 240)' : 'inherit',
                                                            '& .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: isDarkMode ? 'rgb(71 85 105)' : '#e2e8f0'
                                                            },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                borderColor: isDarkMode ? 'rgb(100 116 139)' : '#cbd5e1'
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem value={field.id}>Select an option</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <TextField
                                                    id={field.id}
                                                    type={field.type}
                                                    label={field.label}
                                                    name={field.id}
                                                    placeholder={field.placeholder}
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: isDarkMode ? 'rgb(30 41 59)' : 'white',
                                                        '& .MuiInputLabel-root': {
                                                            color: isDarkMode ? 'rgb(226 232 240)' : 'inherit'
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: isDarkMode ? 'rgb(226 232 240)' : 'inherit'
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: isDarkMode ? 'rgb(71 85 105)' : '#e2e8f0'
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: isDarkMode ? 'rgb(100 116 139)' : '#cbd5e1'
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={handleClose} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDarkMode
                                        ? 'text-slate-200 bg-slate-700 hover:bg-slate-600'
                                        : 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                                    {title}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
};