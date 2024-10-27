"use client"

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SideMenu from '@/components/layout/SideMenu/desktop';
import AnalyticsDashboard from "@/components/analytics_dashboard";

import { VehicleData } from "@/types/vehicle";

import { preProcessCSVData } from '@/utils/vehicle_data';

export default function Home() {
  const [csvData, setCSVData] = useState<VehicleData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/data/Electric_Vehicle_Population_Data.csv');
      const data = await res.text();
      const processedData = preProcessCSVData(data);
      setCSVData(processedData);
    }
    fetchData();
  }, [])

  return (
    <Box sx={{ display: 'flex', width: "100vw", height: "100vh" }}>
      <SideMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          {
            csvData && (
              <AnalyticsDashboard data={csvData} />
            )
          }

          {
            (!csvData) && (
              < Box
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                  No Data
                </Typography>
              </Box>
            )
          }

          {/* <Header />
          <MainGrid /> */}
        </Stack>
      </Box >
    </Box >
  );
}
