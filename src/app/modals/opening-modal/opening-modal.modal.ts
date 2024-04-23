import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-opening-modal',
    templateUrl: 'opening-modal.modal.html',
    styleUrls: ['opening-modal.modal.scss'],
})
export class OpeningModalComponent {



    constructor(private modalController: ModalController) {}

    startGame() {
        console.log('Starting game...');
        this.dismissModal(); // Llama a la función para cerrar el modal
    }

    dismissModal() {
        this.modalController.dismiss(); // Cierra el modal
    }
}
