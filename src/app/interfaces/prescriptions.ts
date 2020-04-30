import Supply from '@interfaces/supplies'
import { Patient } from '@interfaces/patients'
import { User } from '@interfaces/users';

export class Prescriptions {
  _id: string;
  user: User;
  professionalFullname: string;
  patient: Patient;
  dispensedBy: User;
  supplies: Supply[];
  status: string;
  observation: string;
  date: Date;
  detailRow?: boolean;
}
