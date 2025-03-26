const mongoose = require('mongoose');
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/datagrid-db');

const DataSchema = new mongoose.Schema({}, { strict: false });
const DataModel = mongoose.model('Data', DataSchema);

const csvFilePath = path.join(__dirname, '../data/BMW_Aptitude_Test_Test_Data_ElectricCarData.csv');

const seed = async () => {
    try {
        const jsonArray = await csv({ noheader: false, trim: true }).fromFile(csvFilePath);

        // Convert string numbers to actual numbers
        const cleanedData = jsonArray.map((item) => ({
            ...item,
            AccelSec: Number(item.AccelSec),
            TopSpeed_KmH: Number(item.TopSpeed_KmH),
            Range_Km: Number(item.Range_Km),
            Efficiency_WhKm: Number(item.Efficiency_WhKm),
            FastCharge_KmH: Number(item.FastCharge_KmH),
            Seats: Number(item.Seats),
            PriceEuro: Number(item.PriceEuro),
            Date: item.Date,
        }));

        await DataModel.deleteMany({});
        await DataModel.insertMany(cleanedData);
        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error seeding DB:', err);
        mongoose.connection.close();
    }
};

seed();
