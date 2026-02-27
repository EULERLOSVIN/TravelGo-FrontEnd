import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { RegisterBookingModel } from '../models/registerBooking.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterBookingService {
  apiUrl = `${environment.apiUrl}/Booking/RegisterBooking`

  constructor(private http: HttpClient) { }

  registerBooking(bookingData: RegisterBookingModel): Observable<Result<Boolean>> {
    const payload = { dataBooking: bookingData };

    return this.http.post<Result<Boolean>>(this.apiUrl, payload);
  }
}
