import { AlertController, LoadingController } from '@ionic/angular';
import { Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService implements OnDestroy {

  updateIsDownloaded = false;

  checkUpdateIntervalSub: Subscription;
  getUpdateSub: Subscription;

  constructor(private sw: SwUpdate, private alert: AlertController, private loading: LoadingController) { }

  checkUpdate() {
    if (this.sw.isEnabled) {
      this.sw.checkForUpdate().then(() => {
        this.getUpdate();
        console.log(1);
      }).finally(() => {
        if (this.checkUpdateIntervalSub == null) {
          this.checkUpdateIntervalSub = interval(60 * 1000).subscribe(() => {
            if (this.updateIsDownloaded) {
              console.log('2b');
              this.showUpdateAlert();
            } else {
              console.log('2a');
              this.sw.checkForUpdate().then(() => this.getUpdate()).catch(e => console.log(e));
            }
          });
        }
      });
    }
  }

  getUpdate() {
    if (this.sw.isEnabled) {
      if (this.getUpdateSub == null || this.getUpdateSub.closed) {
        this.getUpdateSub = this.sw.available.subscribe(() => {
          this.updateIsDownloaded = true;
          console.log(4);
          this.showUpdateAlert();
        });
      }
    }

    console.log(3);
  }

  showUpdateAlert() {
    console.log(5);
    if (document.querySelector('.update-loading-alert-for-user')) {
      return;
    }

    console.log(6);

    this.alert.create({
      header: 'Dostępna aktualizacja',
      cssClass: 'update-loading-alert-for-user',
      message: `Drogi użytkowniku, dostępna jest aktualizacja, czy chcesz ją teraz wykonać, czy pozwolić by w przyszłości wykonała się sama?\n
                    Wszystko w trosce o najwyższą jakośc usług. Przepraszamy za utrudnienia.`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Odłóż'
        },
        {
          text: 'Aktualizuj',
          handler: () => {
            this.update();
          }
        }
      ]
    }).then(a => a.present()).catch(e => console.log(e));
  }

  update() {
    if (this.sw.isEnabled) {
      this.loading.create({ message: 'Aktualizacja...', spinner: 'dots' }).then(r => {
        r.present().then(() => {
          this.sw.activateUpdate().then(() => {
            this.updateIsDownloaded = false;
            document.location.reload();
            r.dismiss();
          }).catch(e => {
            console.log(e);
            r.dismiss();
            this.alert.create({
              header: 'Niepowodzenie',
              message: e,
              buttons: ['Ok']
            }).then(alert => alert.present());
          });
        }).catch(e => console.log(e));
      });
    }
  }

  ngOnDestroy() {
    this.checkUpdateIntervalSub.unsubscribe();
    if (this.getUpdateSub) {
      this.getUpdateSub.unsubscribe();
    }
  }
}
