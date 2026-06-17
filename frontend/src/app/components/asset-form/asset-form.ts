import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asset-form.html',
  styleUrls: ['./asset-form.css']
})
export class AssetFormComponent {

  @Output() add = new EventEmitter<any>();

  newAsset = {
    name: '',
    type: '',
    status: 'Active',
    location: ''
  };

  onAdd() {
    if (!this.newAsset.name || !this.newAsset.type || !this.newAsset.location) {
      alert('Please fill all fields');
      return;
    }

    this.add.emit(this.newAsset);

    // reset form
    this.newAsset = {
      name: '',
      type: '',
      status: 'Active',
      location: ''
    };
  }
}