import Grid from '@mui/material/Grid2';
import React from "react";
import {DashboardPageLayout} from "../components/layout/DashboardPageLayout.tsx";
import {DashboardSkeletonComponent} from "../components/dashboard/feature/DashboardSkeletonComponent.tsx";

export const DashboardPage: React.FC = () => {
    return (
        <DashboardPageLayout>
            <Grid container spacing={1}>
                <Grid size={5} />
                <Grid size={12}>
                    <DashboardSkeletonComponent height={14} />
                </Grid>
                <Grid size={12}>
                    <DashboardSkeletonComponent height={14} />
                </Grid>
                <Grid size={4}>
                    <DashboardSkeletonComponent height={100} />
                </Grid>
                <Grid size={8}>
                    <DashboardSkeletonComponent height={100} />
                </Grid>
                <Grid size={12}>
                    <DashboardSkeletonComponent height={150} />
                </Grid>
                <Grid size={12}>
                    <DashboardSkeletonComponent height={14} />
                </Grid>
                <Grid size={3}>
                    <DashboardSkeletonComponent height={100} />
                </Grid>
                <Grid size={3}>
                    <DashboardSkeletonComponent height={100} />
                </Grid>
                <Grid size={3}>
                    <DashboardSkeletonComponent height={100} />
                </Grid>
                <Grid size={3}>
                    <DashboardSkeletonComponent height={100} />
                </Grid>
            </Grid>
        </DashboardPageLayout>
    );
};
