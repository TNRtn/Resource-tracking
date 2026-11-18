import { Injectable } from '@angular/core';
import { environment } from '../../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OpertaionalResult } from '../../model/opertaional-result';
import { HealthMeasurement, HealthMeasurementInput, MissingMeasurementDate } from '../model/health-measurement';

@Injectable({
  providedIn: 'root'
})
export class HealthMeasurementService {
  private apiUrl = `${environment.apiURl}/Health`;
  constructor(private http : HttpClient) { }

    getMeasurements(): Observable<OpertaionalResult<HealthMeasurement[]>> {
    return this.http.get<OpertaionalResult<HealthMeasurement[]>>(
      this.apiUrl
    );
  }

   addMeasurement(
    input: HealthMeasurementInput
  ): Observable<OpertaionalResult<number>> {

    return this.http.post<OpertaionalResult<number>>(
      this.apiUrl,
      input
    );
  }

  getMissingMeasurementDates(
  startDate: string,
  endDate: string | null = null
): Observable<OpertaionalResult<MissingMeasurementDate[]>> {
console.log(startDate,endDate)
  let params = new HttpParams()
    .set('startDate', startDate);

  if (endDate) {
    params = params.set('endDate', endDate);
  }

  return this.http.get<OpertaionalResult<MissingMeasurementDate[]>>(
    `${this.apiUrl}/MissingDates`,
    { params }
  );
}
}
