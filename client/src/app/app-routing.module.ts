import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { EvaluationReportComponent } from './evaluation/evaluation-report/evaluation-report.component';
import { AuthGuard } from './_guards/auth.guard';
import { PrintEvaluationComponent } from './evaluation/print-evaluation/print-evaluation.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { EvaluteEmployeeComponent } from './evaluation/evalute-employee/evalute-employee.component';
import { ListEmployeesComponent } from './evaluation/list-employees/list-employees.component';
import { CriterionListComponent } from './criteria/criterion-list/criterion-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewUserComponent } from './account/new-user/new-user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserEditComponent } from './account/user-edit/user-edit.component';
import { UsersListComponent } from './account/users-list/users-list.component';
import { AdminGuard } from './_guards/admin.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { EmployeeDetailsResolver } from './_resolvers/employee-details.reslover';
import { LoginComponent } from './account/login/login.component';
import { UserDetailedResolver } from './_resolvers/user-detailed.reslover';
import { EvaluationDetailsResolver } from './_resolvers/evaluation-details.resolver';
import { ShowEvaluationComponent } from './evaluation/show-evaluation/show-evaluation.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'users/login', component: LoginComponent },
      { path: 'users/:username', component: UserEditComponent, canDeactivate: [PreventUnsavedChangesGuard], resolve: { user: UserDetailedResolver } },
      { path: 'user/new', component: NewUserComponent, canDeactivate: [PreventUnsavedChangesGuard] },
      { path: 'criteria', component: CriterionListComponent, canActivate: [AdminGuard] },
      { path: 'evaluation', component: ListEmployeesComponent, canActivate: [AdminGuard] },
      { path: 'evaluation/evaluation-report', component: EvaluationReportComponent, canActivate: [AdminGuard] },
      {
        path: 'evaluation/evaluate-employee/:id', component: EvaluteEmployeeComponent, canActivate: [AdminGuard], resolve: {
          employee: EmployeeDetailsResolver,
          employeeEvaluation: EvaluationDetailsResolver
        }
      },
      {
        path: 'evaluation/show-evaluation/:id', component: ShowEvaluationComponent, resolve: {
          employee: EmployeeDetailsResolver,
          employeeEvaluation: EvaluationDetailsResolver
        }
      },
      {
        path: 'evaluation/print-evaluation/:id', component: PrintEvaluationComponent, resolve: {
          employee: EmployeeDetailsResolver,
          employeeEvaluation: EvaluationDetailsResolver
        }
      },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'not-found', component: NotFoundComponent },
      { path: 'server-error', component: ServerErrorComponent },
      { path: '**', component: NotFoundComponent, pathMatch: 'full' }

      //member here represnt key of resolver
      // {path:'admin',component:AdminPanelComponent,canActivate:[AdminGuard]},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
