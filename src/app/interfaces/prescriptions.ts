import { AuthService } from '@auth/services/auth.service';

export class Prescriptions {
  _id: string;
  user_id: string;
  professionalFullname: string;
  patient_id: string;
  dispensedBy: string;
  status: string;
  date: Date;
  supplies: string[];
}
