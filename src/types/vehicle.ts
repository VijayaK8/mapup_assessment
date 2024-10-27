export type VehicleData = {
    "2020 Census Tract": string;
    "Base MSRP": string;
    "City": string;
    "Clean Alternative Fuel Vehicle (CAFV) Eligibility": string;
    "County": string;
    "DOL Vehicle ID": string;
    "Electric Range": string;
    "Electric Utility": string;
    "Electric Vehicle Type": string;
    "Legislative District": string;
    "Make": string;
    "Model": string;
    "Model Year": string;
    "Postal Code": string;
    "State": string;
    "VIN (1-10)": string;
    "Vehicle Location": string;
};

export type VehicleMakeData = {
    make: string;
    models: {
        [key: string]: {
            model: string,
            count: number,
            year: { [key: string]: number }
        }
    };
    count: number;
}

export type VehicleSalesDataByType = {
    electric_vehicle_type: string;
    sales: { [key: string]: VehicleMakeData }
}

export type VehicleSalesData = {
    byType: { [key: string]: VehicleSalesDataByType },
    byModel: { [key: string]: { model: string, count: number } },
    byYear: { [key: string]: { [key: string]: { model: string, count: number } } }
} | undefined


export type SellerInfo = {
    make: string;
    model: string;
    count: number;
}

export type VehicleDataByYear = {
    count: number;
    sellersInOrder: SellerInfo[];
}
