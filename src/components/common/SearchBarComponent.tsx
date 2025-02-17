import React from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";

export interface SearchableItem {
    id: string;
    name?: string; // Make `name` optional since it might be null/undefined
    type?: string; // Add `type` as an optional property
    [key: string]: any;
}

interface SearchBarComponentProps<T extends SearchableItem> {
    title?: string;
    data: T[];
    onSelect?: (item: T | null) => void;
    getOptionLabel?: (option: T) => string;
    filterOptions?: (options: T[], searchValue: any) => T[];
    className?: string;
}

export const SearchBarComponent = <T extends SearchableItem>({
                                                                 title,
                                                                 data,
                                                                 onSelect,
                                                                 getOptionLabel = (option: T) =>
                                                                     option.name != null ? `${option.id} - ${option.name}` : `${option.id} - ${option.type ?? ''}`,
                                                                 filterOptions,
                                                                 className = "w-2/5"
                                                             }: SearchBarComponentProps<T>) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly T[]>([]);
    const [loading, setLoading] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        (async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async data fetching
            setLoading(false);
            setOptions(data);
        })();
    };

    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    };

    return (
        <div className="mt-3 w-full flex justify-end">
            <Autocomplete
                className={className}
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                onChange={(_, value) => onSelect?.(value)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={getOptionLabel}
                options={options}
                loading={loading}
                filterOptions={filterOptions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={title}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            },
                        }}
                    />
                )}
            />
        </div>
    );
};