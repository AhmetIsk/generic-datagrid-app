import { FilterItem } from './api.service';
import { RowData } from '../types/RowData';
import { CarData } from '../types/DomainModels';
import { v4 as uuidv4 } from 'uuid';

const sampleCarData: CarData[] = [
  {
    brand: 'BMW',
    model: 'i4',
    bodyStyle: 'Gran Coupe',
    segment: 'D',
    powerTrain: 'BEV',
    price: 65900,
    releaseDate: '2021-11-15'
  },
  {
    brand: 'BMW',
    model: 'i7',
    bodyStyle: 'Sedan',
    segment: 'F',
    powerTrain: 'BEV',
    price: 135900,
    releaseDate: '2022-07-02'
  },
  {
    brand: 'BMW',
    model: 'iX',
    bodyStyle: 'SUV',
    segment: 'E',
    powerTrain: 'BEV',
    price: 87900,
    releaseDate: '2021-09-12'
  },
  {
    brand: 'BMW',
    model: 'iX3',
    bodyStyle: 'SUV',
    segment: 'D',
    powerTrain: 'BEV',
    price: 69900,
    releaseDate: '2021-01-30'
  },
  {
    brand: 'BMW',
    model: 'i3',
    bodyStyle: 'Hatchback',
    segment: 'B',
    powerTrain: 'BEV',
    price: 39900,
    releaseDate: '2013-07-29'
  },
  {
    brand: 'MINI',
    model: 'Cooper SE',
    bodyStyle: 'Hatchback',
    segment: 'B',
    powerTrain: 'BEV',
    price: 34900,
    releaseDate: '2020-03-01'
  }
];

const sampleRowData: RowData<CarData>[] = sampleCarData.map(car => ({
  id: uuidv4(),
  data: car,
  ...car
}));

/**
 * Fetch vehicle data based on search and filters
 * @param search Search term
 * @param filters Applied filters
 * @returns Promise with filtered data
 */
export async function fetchVehicleData(
  search: string,
  filters: FilterItem[]
): Promise<RowData<CarData>[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredData = [...sampleRowData];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(row =>
          Object.values(row).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchLower)
          )
        );
      }

      if (filters.length > 0) {
        filteredData = filteredData.filter(row => {
          return filters.every(filter => {
            const field = filter.filter.toLowerCase();
            const value = row[field];

            if (!value && filter.operator !== 'empty') return false;

            switch (filter.operator) {
              case 'equals':
                return value === filter.value;
              case 'contains':
                return typeof value === 'string' && value.toLowerCase().includes(filter.value.toLowerCase());
              case 'starts':
                return typeof value === 'string' && value.toLowerCase().startsWith(filter.value.toLowerCase());
              case 'ends':
                return typeof value === 'string' && value.toLowerCase().endsWith(filter.value.toLowerCase());
              case 'empty':
                return !value || value === '';
              default:
                return true;
            }
          });
        });
      }

      resolve(filteredData);
    }, 500);
  });
}

/**
 * Export vehicle data to CSV
 * @param data Data to export
 */
export async function exportVehicleData(data: RowData<CarData>[] | null): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!data || data.length === 0) {
        reject(new Error('No data to export'));
        return;
      }

      try {
        const headers = ['Brand', 'Model', 'Body Style', 'Segment', 'Power Train', 'Price (€)', 'Release Date'];
        const csvRows = [headers];

        data.forEach(row => {
          const csvRow = [
            row.brand,
            row.model,
            row.bodyStyle,
            row.segment,
            row.powerTrain,
            `€${row.price.toLocaleString()}`,
            new Date(row.releaseDate).toLocaleDateString()
          ];
          csvRows.push(csvRow);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');

        console.log('Exported data:', csvContent);

        resolve();
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}