import { Component, Input } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() public modalId: string;
  @Input() public modalClass: string;
}

@Component({
  selector: 'modal-title',
  templateUrl: './modal-title.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalTitleComponent { }

@Component({
  selector: 'modal-body',
  templateUrl: './modal-body.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalBodyComponent { }

@Component({
  selector: 'modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalFooterComponent { }
