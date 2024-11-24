import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { Service } from '../interfaces';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit {
  environment = environment;

  constructor(private fb: FormBuilder, private api: ApiService) {}

  @Input() services: Service[] = [];
  @Output() outputCloseServiceList: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    for (const [i, service] of this.services.entries()) {
      this.addFields(i, service.name, service.price, service.id!);
    }
    this.form.updateValueAndValidity();
  }

  getGroup(index: number) {
    return this.form.get('group-' + index);
  }
  getField(groupNumber: number, fieldName: string) {
    return this.getGroup(groupNumber)?.get(fieldName);
  }

  addFields(
    index: number,
    serviceName: string,
    value: number,
    serviceId: string
  ) {
    const group = this.fb.group({
      id: [serviceId],
      name: [serviceName, [Validators.required, Validators.maxLength(50)]],
      price: [value, [Validators.required, Validators.min(0)]],
    });
    const groupName = 'group-' + index;
    this.form.addControl(groupName, group);
  }

  getIndexForNewGroup() {
    let i = 0;
    while (this.getGroup(i) && i < 1000) {
      i++;
    }
    return i++;
  }

  addField() {
    const lastIndex = this.getIndexForNewGroup();
    this.addFields(lastIndex, '', 0, '');
    this.form.updateValueAndValidity();
    this.services[lastIndex] = { name: '', price: 0 };
  }

  removeField(index: number) {
    this.services[index].isDeleting = true;
    if (this.services[index].id) {
      this.api.deleteService(this.services[index].id!).subscribe({
        next: () => {
          const groupName = 'group-' + index;
          this.form.removeControl(groupName);
          this.form.updateValueAndValidity();
          this.services[index].isDeleted = true;
        },
        error: () => {
          this.services[index].isDeleting = false;
        },
      });
    } else {
      const groupName = 'group-' + index;
      this.form.removeControl(groupName);
      this.form.updateValueAndValidity();
      delete this.services[index];
    }
  }

  closeList() {
    this.outputCloseServiceList.emit(true);
  }

  submit() {
    const data: Service[] = [];
    for (let i in this.form.value) {
      const groupNumber = i.slice(i.lastIndexOf('-') + 1);
      data.push(this.form.value[i]);
    }
    data.forEach((s) => {
      if (!s.id) {
        delete s.id;
      }
    });
    this.api.submitList(data).subscribe({
      next: (res) => {
        this.services = [];
        this.closeList();
      },
      error: (err) => {
        this.closeList();
      },
    });
  }
}
