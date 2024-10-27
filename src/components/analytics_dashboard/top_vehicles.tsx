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
    const models: modelInfo[] = [];

    for (const key in data) {
        models.push(data[key]);
    }

    models.sort(function (a, b) { return b.count - a.count });

    return models;
}

export default function TopVehicles(data: topVehicleProps) {
    const [yearlyData, setYearlyData] = useState<{ [key: string]: { [key: string]: { model: string, count: number } } }>({});
    const [models, setModels] = useState<modelInfo[]>([]);
    const [year, setYears] = useState<string[]>([]);
    const [filters, setFilters] = useState<GraphFilters>({
        year: 'ALL',
    })

    useEffect(() => {
        setYearlyData(data.byYear);
        const models_d: modelInfo[] = getModelInOrder(data.byYear['ALL']);
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
        const models_d: modelInfo[] = getModelInOrder(yearlyData[filters.year]);
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
                                const val = event.target.value as string;
                                setFilters({
                                    year: val,
                                })

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