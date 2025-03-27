/**
 * Car data model representing vehicle information
 */
export interface CarData {
  brand: string;
  model: string;
  bodyStyle: string;
  segment: string;
  powerTrain: string;
  price: number;
  releaseDate: string | Date;
}