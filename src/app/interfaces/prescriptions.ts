import { AuthService } from '@auth/services/auth.service';
import Supply from '@interfaces/supplies'

export class Prescriptions {
  _id: string;
  user_id: string;
  professionalFullname: string;
  patientId: string;
  dispensedBy: string;
  supplies: Supply[];
  status: string;
  date: Date;
}
