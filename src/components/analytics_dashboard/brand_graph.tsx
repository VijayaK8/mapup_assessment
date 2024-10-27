import * as React from 'react';
import { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { BarChart } from '@mui/x-charts/BarChart';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { VehicleSalesDataByType, VehicleMakeData } from "@/types/vehicle";

interface BrandGraphProps {
    data: { [key: string]: VehicleSalesDataByType }
}

type GraphFilters = {
    type: string,
    model: string,
    make: string,
    year: string,
    countType: string
}

type GraphData = {
    labels: string[],
    data: number[],
} | undefined


function getAllModels(data: VehicleMakeData): string[] {
    return Object.keys(data.models);
}

function getAllYears(data: { [key: string]: number }): string[] {
    return Object.keys(data);
}

function getLabels(data: { [key: string]: VehicleMakeData }, filter: GraphFilters): string[] {
    if (filter.make == 'ALL') {
        return Object.keys(data);
    }

    if (filter.model == 'ALL') {
        return getAllModels(data[filter.make]);
    }

    if (filter.year == 'ALL') {
        return getAllYears(data[filter.make].models[filter.model].year);
    }

    return [];
}

function getCounts(data: { [key: string]: VehicleMakeData }, filter: GraphFilters): number[] {
    let counts: number[] = [];

    if (filter.make == 'ALL') {
        counts = getLabels(data, filter).map((ky: string) => {
            return data[ky].count;
        })

        if (filter.countType == "COUNT") {
            return counts;
        }

        const total_count = counts.reduce((acc, cv) => acc + cv, 0);

        counts = counts.map((cnt: number) => {
            return Math.round(((cnt) / total_count) * 100 * 100) / 100;
        })

        return counts;
    }

    if (filter.model == 'ALL') {
        counts = getLabels(data, filter).map((ky: string) => {
            return data[filter.make].models[ky].count;
        })
        if (filter.countType == "COUNT") {
            return counts;
        }
        const total_count = counts.reduce((acc, cv) => acc + cv, 0);
        counts = counts.map((cnt: number) => {
            return Math.round(((cnt) / total_count) * 100 * 100) / 100;
        })

        return counts;
    }

    if (filter.year == 'ALL') {
        counts = getLabels(data, filter).map((ky: string) => {
            return data[filter.make].models[filter.model].year[ky];
        })
        if (filter.countType == "COUNT") {
            return counts;
        }
        const total_count = counts.reduce((acc, cv) => acc + cv, 0);
        counts = counts.map((cnt: number) => {
            return Math.round(((cnt) / total_count) * 100 * 100) / 100;
        })

        return counts;
    }


    return counts;
}

export default function BrandGraph({ data }: BrandGraphProps) {
    const [graphData, setGraphData] = useState<GraphData>(undefined);
    const [analyzedData, setAnalyzedData] = useState<{ [key: string]: VehicleSalesDataByType }>({});
    const [filters, setFilters] = useState<GraphFilters>({
        type: 'ALL',
        model: 'ALL',
        make: 'ALL',
        year: 'ALL',
        countType: 'COUNT',
    })
    const [types, setTypes] = useState<string[]>([]);
    const [makers, setMakers] = useState<string[]>([]);
    const [model, setModels] = useState<string[]>([]);



    useEffect(() => {
        const aggregated_data: { [key: string]: VehicleSalesDataByType } = data;
        setAnalyzedData(aggregated_data);
        setGraphData({
            labels: getLabels(aggregated_data[filters.type].sales, filters),
            data: getCounts(aggregated_data[filters.type].sales, filters)
        })
        setTypes(Object.keys(aggregated_data));
        setMakers(Object.keys(aggregated_data[filters.type].sales));
    }, [data]);

    useEffect(() => {
        if (Object.keys(analyzedData).length == 0) {
            return;
        }
        setGraphData({
            labels: getLabels(analyzedData[filters.type].sales, filters),
            data: getCounts(analyzedData[filters.type].sales, filters)
        })
    }, [filters]);


    return (
        <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
                <Typography component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                    Vehicle Sales
                </Typography>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                >
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            id="type-id"
                            value={filters.type}
                            onChange={(event: SelectChangeEvent) => {
                                const val = event.target.value as string;
                                if (val == 'ALL') {
                                    setFilters({
                                        type: 'ALL',
                                        model: 'ALL',
                                        make: 'ALL',
                                        year: 'ALL',
                                        countType: filters.countType,
                                    })
                                    setMakers(Object.keys(analyzedData["ALL"].sales))
                                    setModels([]);
                                    return;
                                }

                                setMakers(Object.keys(analyzedData[val].sales));
                                setModels([]);

                                const n_filters = {
                                    type: val,
                                    model: 'ALL',
                                    make: 'ALL',
                                    year: 'ALL',
                                    countType: filters.countType,
                                }

                                setFilters(n_filters)

                            }}
                            label="Type"
                        >

                            {
                                (types.map((typ: string, id: number) => {
                                    return <MenuItem value={typ} key={id}>{typ}</MenuItem>
                                }))
                            }
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="Company-label">Company</InputLabel>
                        <Select
                            labelId="Company-label"
                            id="Company-id"
                            value={filters.make}
                            onChange={(event: SelectChangeEvent) => {
                                const val = event.target.value as string;
                                if (val == 'ALL') {
                                    setFilters({
                                        type: filters.type,
                                        model: 'ALL',
                                        make: 'ALL',
                                        year: 'ALL',
                                        countType: filters.countType,
                                    })
                                    setModels([]);
                                    return;
                                }

                                setModels(Object.keys(analyzedData[filters.type].sales[val].models));

                                const n_filters = {
                                    type: filters.type,
                                    model: 'ALL',
                                    make: val,
                                    year: 'ALL',
                                    countType: filters.countType,
                                }

                                setFilters(n_filters)

                                // setGraphData({
                                //     labels: getLabels(analyzedData, n_filters),
                                //     data: getCounts(analyzedData, n_filters)
                                // })


                            }}
                            label="Make"
                        >
                            <MenuItem value="ALL">
                                ALL
                            </MenuItem>
                            {
                                (makers.map((make: string, id: number) => {
                                    return <MenuItem value={make} key={id}>{make}</MenuItem>
                                }))
                            }
                        </Select>
                    </FormControl>
                    {
                        (model.length > 0) && (
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="model-select-label">Model</InputLabel>
                                <Select
                                    labelId="model-select-label"
                                    id="model-select"
                                    value={filters.model}
                                    onChange={(event: SelectChangeEvent) => {
                                        const val = event.target.value as string;
                                        if (val == 'ALL') {
                                            setFilters({
                                                type: filters.type,
                                                model: 'ALL',
                                                make: filters.make,
                                                year: 'ALL',
                                                countType: filters.countType,
                                            })
                                            return;
                                        }

                                        const n_filters = {
                                            type: filters.type,
                                            model: val,
                                            make: filters.make,
                                            year: 'ALL',
                                            countType: filters.countType,
                                        }

                                        setFilters(n_filters)
                                    }}
                                    label="Model"
                                >
                                    <MenuItem value="ALL">
                                        ALL
                                    </MenuItem>
                                    {
                                        (model.map((mod: string, id: number) => {
                                            return <MenuItem value={mod} key={id}>{mod}</MenuItem>
                                        }))
                                    }
                                </Select>
                            </FormControl>
                        )
                    }
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="aggregated_as_label">Aggregated as</InputLabel>
                        <Select
                            labelId="aggregated_as_label"
                            id="aggregated_as"
                            value={filters.countType}
                            onChange={(event: SelectChangeEvent) => {
                                const val = event.target.value as string;
                                setFilters({
                                    type: filters.type,
                                    model: filters.model,
                                    make: filters.make,
                                    year: filters.year,
                                    countType: val,
                                })

                            }}
                            label="Aggregated as"
                        >
                            <MenuItem value="COUNT">
                                COUNT
                            </MenuItem>
                            <MenuItem value="PERCENTAGE">
                                PERCENTAGE
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Stack>

                {
                    (graphData) && (<BarChart
                        borderRadius={8}
                        yAxis={
                            [
                                {
                                    scaleType: 'band',
                                    // categoryGapRatio: 0.5,
                                    data: graphData.labels,
                                },
                            ]
                        }
                        series={[
                            {
                                id: 'graph_view',
                                label: (filters.countType == "PERCENTAGE") ? "Percentage Share" : "Total",
                                data: graphData.data,
                            },

                        ]}
                        height={550}
                        margin={{ left: 80, right: 80, top: 20, bottom: 20 }}
                        layout="horizontal"
                        grid={{ vertical: true }}
                        slotProps={{
                            legend: {
                                hidden: true,
                            },
                        }}
                    />)
                }

            </CardContent>
        </Card>
    )
}