import React from "react";
import {Autocomplete, CircularProgress, TextField} from "@mui/material";

interface Film {
    title: string;
    year: number;
}

function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

interface SearchBarComponentProps {
    title?: string
}

export const SearchBarComponent = ({title}: SearchBarComponentProps) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly Film[]>([]);
    const [loading, setLoading] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        (async () => {
            setLoading(true);
            await sleep(1e3);
            setLoading(false);

            setOptions([...topFilms]);
        })();
    };

    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    };

    return (
        <>
            <div className="mt-3 w-full flex justify-end">
                <Autocomplete
                    className="w-2/5"
                    open={open}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    isOptionEqualToValue={(option, value) => option.title === value.title}
                    getOptionLabel={(option) => option.title}
                    options={options}
                    loading={loading}
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
        </>
    );
};

const topFilms = [
    {title: 'The Shawshank Redemption', year: 1994},
    {title: 'The Godfather', year: 1972},
];