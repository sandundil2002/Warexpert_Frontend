import { styled } from "@mui/material";

export const DashboardSkeletonComponent = styled('div') <
    { height: number }>(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    height,
    content: '" "',
}));
