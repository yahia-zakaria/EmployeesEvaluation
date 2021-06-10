import { GradeStatistic } from './gradeStatistic';
export interface Dashboard
{
allEmployees : number;
evaluatedEmployees : number;
notEvaluatedEmployees : number;
evaluatedEmployeesRate : number;
notEvaluatedEmployeesRate : number;
gradeStatistics : GradeStatistic[];
}
