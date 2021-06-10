import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import {NgxPrintModule} from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationModule } from 'ngx-bootstrap/pagination'
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HasRoleDirective } from './_directives/has-role.directive';
import { HomeComponent } from './home/home.component';
import { UsersListComponent } from './account/users-list/users-list.component';
import { NotFoundComponent } from './not-found/not-found.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { FooterComponent } from './footer/footer.component';
import { RolesModalComponent } from './modals/roles-modal/roles-modal.component';
import { UserEditComponent } from './account/user-edit/user-edit.component';
import { ConfirmDailogComponent } from './confirm-dailog/confirm-dailog.component';
import { NewUserComponent } from './account/new-user/new-user.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { DateInputComponent } from './_forms/date-input/date-input.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { LoginComponent } from './account/login/login.component';
import { AddCriterionComponent } from './criteria/add-criterion/add-criterion.component';
import { CriterionListComponent } from './criteria/criterion-list/criterion-list.component';
import { UpdateCriterionComponent } from './criteria/update-criterion/update-criterion.component';
import { ListEmployeesComponent } from './evaluation/list-employees/list-employees.component';
import { EvaluteEmployeeComponent } from './evaluation/evalute-employee/evalute-employee.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ShowEvaluationComponent } from './evaluation/show-evaluation/show-evaluation.component';
import { PrintEvaluationComponent } from './evaluation/print-evaluation/print-evaluation.component';
import { DataTablesModule } from 'angular-datatables';
import { EvaluationReportComponent } from './evaluation/evaluation-report/evaluation-report.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChangePasswordComponent } from './account/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HasRoleDirective,
    HomeComponent,
    UsersListComponent,
    NotFoundComponent,
    FooterComponent,
    RolesModalComponent,
    UserEditComponent,
    ConfirmDailogComponent,
    NewUserComponent,
    TextInputComponent,
    DateInputComponent,
    LoginComponent,
    AddCriterionComponent,
    CriterionListComponent,
    UpdateCriterionComponent,
    ListEmployeesComponent,
    EvaluteEmployeeComponent,
    ServerErrorComponent,
    ShowEvaluationComponent,
    PrintEvaluationComponent,
    EvaluationReportComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    CollapseModule.forRoot(),
    NgxSpinnerModule,
    ToastrModule.forRoot({
      positionClass:"toast-bottom-right"
    }),
    ReactiveFormsModule,
    AngularEditorModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgxPrintModule,
    DataTablesModule,
  NgCircleProgressModule.forRoot({
    "radius": 60,
      "space": -10,
      "outerStrokeGradient": false,
      "outerStrokeWidth": 12,
      "outerStrokeColor": "#00724c",
      "outerStrokeGradientStopColor": "#00724c",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "title": "UI",
      "animateTitle": false,
      "animationDuration": 300,
      "showUnits": true,
      "showBackground": false,
      "clockwise": false,
      "startFromZero": true,
      "lazy": true,
      'showSubtitle' : false,
      'responsive' : true
  }),
  NgxBarcodeModule
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    {provide:HTTP_INTERCEPTORS,useClass:LoadingInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
