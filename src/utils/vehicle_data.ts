import Papa from 'papaparse';

import { VehicleData, VehicleMakeData, VehicleSalesDataByType, VehicleSalesData } from "@/types/vehicle";
import { count } from 'console';

export function preProcessCSVData(input_data: string): VehicleData[] {
    const { data } = Papa.parse(input_data, {
        header: true
    })
    return data as VehicleData[];
}

export function aggregateSalesData(data: VehicleData[]): VehicleSalesData {
    let final_data: { [key: string]: VehicleSalesDataByType } = {};
    let top_selling_models: { [key: string]: { model: string, count: number } } = {};
    let top_selling_by_year: { [key: string]: { [key: string]: { model: string, count: number } } } = {};

    final_data["ALL"] = {
        electric_vehicle_type: "ALL",
        sales: {}
    }

    for (let i = 0; i < data.length; i++) {
        let make = data[i]["Make"];
        let model = data[i]["Model"];
        let year = data[i]["Model Year"];
        let vehicle_type = data[i]["Electric Vehicle Type"];
        let car_model = `${make}-${model}`;
        let all_sales = final_data["ALL"].sales;

        if (!top_selling_models.hasOwnProperty(car_model)) {
            top_selling_models[car_model] = {
                model: car_model,
                count: 0
            }
        }

        if (!top_selling_by_year.hasOwnProperty(year)) {
            top_selling_by_year[year] = {};
        }
        if (!top_selling_by_year[year].hasOwnProperty(car_model)) {
            top_selling_by_year[year][car_model] = {
                model: car_model,
                count: 0
            };
        }

        top_selling_models[car_model].count += 1;

        if (!final_data.hasOwnProperty(vehicle_type)) {
            final_data[vehicle_type] = {
                electric_vehicle_type: vehicle_type,
                sales: {}
            }
        }
        let this_type_sales = final_data[vehicle_type].sales;


        if (!all_sales.hasOwnProperty(make)) {
            all_sales[make] = {
                make: make,
                models: {},
                count: 0
            };
        }
        all_sales[make].count += 1;

        if (!all_sales[make].models.hasOwnProperty(model)) {
            all_sales[make].models[model] = {
                model: model,
                count: 0,
                year: {}
            }
        }
        all_sales[make].models[model].count += 1;

        if (!all_sales[make].models[model].year.hasOwnProperty(year)) {
            all_sales[make].models[model].year[year] = 0;
        }
        all_sales[make].models[model].year[year] += 1;

        if (!this_type_sales.hasOwnProperty(make)) {
            this_type_sales[make] = {
                make: make,
                models: {},
                count: 0
            };
        }
        this_type_sales[make].count += 1;

        if (!this_type_sales[make].models.hasOwnProperty(model)) {
            this_type_sales[make].models[model] = {
                model: model,
                count: 0,
                year: {}
            }
        }
        this_type_sales[make].models[model].count += 1;

        if (!this_type_sales[make].models[model].year.hasOwnProperty(year)) {
            this_type_sales[make].models[model].year[year] = 0;
        }
        this_type_sales[make].models[model].year[year] += 1;

        final_data["ALL"].sales = all_sales;
        final_data[vehicle_type].sales = this_type_sales;
    }

    top_selling_by_year['ALL'] = top_selling_models;

    return {
        byType: final_data,
        byModel: top_selling_models,
        byYear: top_selling_by_year
    };
}