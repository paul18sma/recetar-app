import { AuthService } from '@auth/services/auth.service';
import Supply from '@interfaces/supplies'
import Patient from '@interfaces/patients'

export class Prescriptions {
  _id: string;
  user_id: string;
  professionalFullname: string;
  patient: Patient;
  dispensedBy: string;
  supplies: Supply[];
  status: string;
  date: Date;
  detailRow?: boolean;
}
