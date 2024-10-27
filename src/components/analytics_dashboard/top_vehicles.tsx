import * as React from 'react';
import { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import Stack from '@mui/material/Stack';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { VehicleSalesDataByType, VehicleMakeData } from "@/types/vehicle";

interface topVehicleProps {
    byYear: { [key: string]: { [key: string]: { model: string, count: number } } }
}

type GraphFilters = {
    year: string,
}

type modelInfo = {
    model: string,
    count: number
}

function getModelInOrder(data: { [key: string]: { model: string, count: number } }): modelInfo[] {
    let models: modelInfo[] = [];

    for (var key in data) {
        models.push(data[key]);
    }

    models.sort(function (a, b) { return b.count - a.count });

    return models;
}

export default function TopVehicles(data: topVehicleProps) {
    let [yearlyData, setYearlyData] = useState<{ [key: string]: { [key: string]: { model: string, count: number } } }>({});
    let [models, setModels] = useState<modelInfo[]>([]);
    let [year, setYears] = useState<string[]>([]);
    let [filters, setFilters] = useState<GraphFilters>({
        year: 'ALL',
    })

    useEffect(() => {
        setYearlyData(data.byYear);
        let models_d: modelInfo[] = getModelInOrder(data.byYear['ALL']);
        setFilters({
            year: 'ALL'
        })
        setYears(Object.keys(data.byYear));
        setModels(models_d.slice(0, 3));
    }, [data]);

    useEffect(() => {
        if (Object.keys(yearlyData).length == 0) {
            return;
        }
        let models_d: modelInfo[] = getModelInOrder(yearlyData[filters.year]);
        setModels(models_d.slice(0, 3));
    }, [filters]);

    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
                <Typography component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                    Top Selling
                </Typography>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                >
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="year-label">Year</InputLabel>
                        <Select
                            labelId="year-label"
                            id="year-id"
                            value={filters.year}
                            onChange={(event: SelectChangeEvent) => {
                                let val = event.target.value as string;
                                setFilters({
                                    year: val,
                                })
                                // if (val == 'ALL') {
                                //     setFilters({
                                //         type: 'ALL',
                                //         model: 'ALL',
                                //         make: 'ALL',
                                //         year: 'ALL',
                                //         countType: filters.countType,
                                //     })
                                //     setMakers(Object.keys(analyzedData["ALL"].sales))
                                //     setModels([]);
                                //     setYear([]);
                                //     return;
                                // }

                                // setMakers(Object.keys(analyzedData[val].sales));
                                // setModels([]);
                                // setYear([]);

                                // let n_filters = {
                                //     type: val,
                                //     model: 'ALL',
                                //     make: 'ALL',
                                //     year: 'ALL',
                                //     countType: filters.countType,
                                // }

                                // setFilters(n_filters)

                            }}
                            label="Type"
                        >

                            {
                                (year.map((typ: string, id: number) => {
                                    return <MenuItem value={typ} key={id}>{typ}</MenuItem>
                                }))
                            }
                        </Select>
                    </FormControl>
                </Stack>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {
                        (models.map((md, id: number) => {
                            return (
                                <>
                                    <ListItem alignItems="flex-start" key={id}>
                                        <Typography component="h6">
                                            {md.model.split("-")[0]}  {md.model.split("-")[1]}
                                        </Typography>
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </>
                            )
                        }))
                    }


                </List>
            </CardContent>
        </Card>
    )

}