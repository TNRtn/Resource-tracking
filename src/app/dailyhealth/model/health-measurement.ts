export interface HealthMeasurementInput {
  measurementValue: number;
  measurementDate: string;
  notes?: string;
}

export interface HealthMeasurement {
  id: number;
  measurementType: string;
  bodyPart: string;
  measurementValue: number;
  unit: string;
  measurementDate: string;
  notes?: string;
  createdDate?: string;
}

export interface MissingMeasurementDate {
  missingDate: string;
}

export interface MissingMeasurementResponse {
  isSuccess: boolean;
  message: string;
  data: MissingMeasurementDate[];
  error?: string;
}