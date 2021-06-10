import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { LanguageApp } from 'src/app/_models/languageApp';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: Partial<User[]> = [];
  bsModalRef: BsModalRef;
  dtOptions: DataTables.Settings = {};
  baseUrl = environment.baseUrl


  constructor(private accountService: AccountService, private modalService: BsModalService,
    private router: Router, private toastr: ToastrService, private http: HttpClient) { }
  ngOnInit(): void {
    this.getUsers();

    //datatable config
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      language: LanguageApp.arabic_datatables,
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(
          this.baseUrl + 'account/users-with-roles',
          dataTablesParameters, {}
        ).subscribe(resp => {
          that.users = resp.data;

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [{ data: 'userName' }, { data: 'fullName' }, { data: 'phoneNumber' }, { data: 'locked' }, { data: 'roles' }]
    };
  }
  getUsers() {
    this.accountService.getUsersWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  localizeRolesNames(roles: string[]) {
    let localizedRoles = []
    for (let index = 0; index < roles.length; index++) {
      localizedRoles.push((roles[index] == "Employee") ? "موظف" : "مدير النظام");
    }
    return localizedRoles;
  }

  openRolesModal(user: User) {
    const config = {
      class: "modal-dailog-centered",
      initialState: {
        user,
        roles: this.getUserRoles(user)
      }
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);

    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {


      const rolesToUpdate = {
        roles: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      this.accountService.updateRoles(user.userName, rolesToUpdate.roles).subscribe(() => {
        user.roles = [...rolesToUpdate.roles];
      })
    });
  }
  private getUserRoles(user: User) {
    const roles = [];
    let avialableRoles: any[] = [
      { name: 'Admin', value: 'مدير النظام' },
      { name: 'Employee', value: 'موظف' },
    ];
    avialableRoles.forEach(role => {
      let isMatch = false;
      for (const userRole of user.roles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    });
    return roles;
  }
  lockUser(user: User) {
    this.accountService.lockUser(user.userName).subscribe(() => {
      const msg = user.locked ? 'تفعيل' : 'تعطيل';
      this.toastr.success('تم ' + msg + ' المستخدم بنجاح');
      user.locked = !user.locked;
    })
  }
  resetPassword(username) {
    this.accountService.resetPassword(username).subscribe(() => {
      this.toastr.success("تمت إعادة تعيين كلمة المرور")
    })
  }

}
