import * as React from 'react';
import {CloudUploadIcon, X} from 'lucide-react';
import {Button, FormControl, InputLabel, Select, TextField} from "@mui/material";
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
            <div className="overflow-auto bg-opacity-50 flex items-center justify-center">
                <div className="bg-gray-500 top-40 rounded-lg w-full max-w-md p-6 absolute text-white">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <button onClick={handleClose} className="text-white bg-red-700 rounded">
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
                                            >
                                                {field.label}
                                            </Button>
                                            // <div className="flex items-center gap-2">
                                            //     <button
                                            //         type="button"
                                            //         className="px-4 py-2 bg-gray-200 rounded text-sm"
                                            //     >
                                            //         Choose File
                                            //     </button>
                                            //     <span className="text-sm text-gray-500">No file chosen</span>
                                            // </div>
                                        ) : field.type === 'select' ? (
                                            <FormControl variant="standard" sx={{ minWidth: 195 }}>
                                                <InputLabel>{field.label}</InputLabel>
                                                <Select
                                                    labelId={field.label}
                                                    id={field.id}
                                                    value={field.id}
                                                    // onChange={}
                                                    label={field.label}
                                                >
                                                    <MenuItem value={field.id}>Select an option</MenuItem>
                                                </Select>
                                            </FormControl>

                                            // <select
                                            //     id={field.id}
                                            //     name={field.id}
                                            //     className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                            // >
                                            //     <option value="">Select an option</option>
                                            // </select>
                                        ) : (
                                            <TextField id={field.id} type={field.type} label={field.label} name={field.id} placeholder={field.placeholder} variant="standard" />
                                            // <input
                                            //     type={field.type}
                                            //     id={field.id}
                                            //     name={field.id}
                                            //     placeholder={field.placeholder}
                                            //     className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                            // />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={handleClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                            <button type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                                {title}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};