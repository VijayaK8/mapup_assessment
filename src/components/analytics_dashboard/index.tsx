import * as React from 'react';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

import { VehicleData } from "@/types/vehicle";
import { aggregateSalesData } from "@/utils/vehicle_data";
import { VehicleSalesData } from "@/types/vehicle";

import BrandGraph from './brand_graph';
import TopVehicles from './top_vehicles';

interface AnalyticsDashboardProps {
    data: VehicleData[]
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
    const [analyzedData, setAnalyzedData] = useState<VehicleSalesData>(undefined);

    useEffect(() => {
        const aggregated_data: VehicleSalesData = aggregateSalesData(data);
        setAnalyzedData(aggregated_data);
    }, [data]);

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Overview
            </Typography>
            {
                analyzedData && (
                    <Grid
                        container
                        spacing={2}
                        columns={12}
                    >
                        <Grid size={{ xs: 12, md: 12 }}>
                            <BrandGraph data={analyzedData.byType} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 12 }}>
                            <TopVehicles byYear={analyzedData.byYear} />
                        </Grid>
                    </Grid>
                )
            }

        </Box>
    )
}