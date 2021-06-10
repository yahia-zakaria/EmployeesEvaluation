import { EmployeeScore } from './employeeScore';

export interface FinalEvaluation {
  employeeId: string;
  grade : string;
  evaluatedBy : string;
  evaluatedAt : Date;
  employeeScore: EmployeeScore[]
}
