export class InfoService {
  private isInfo: boolean = false;
  private infoText: string = '';
  private confirm: boolean = false;

  get data() {
    return {
      isInfo: this.isInfo,
      infoText: this.infoText,
      confirm: this.confirm,
    };
  }
  showInfo(text: string, confirm: boolean = false) {
    this.isInfo = true;
    this.infoText = text;
    this.confirm = confirm;
    setTimeout(() => {
      this.hideInfo();
    }, 5000);
  }

  private hideInfo() {
    this.isInfo = false;
    this.infoText = '';
    this.confirm = false;
  }

  constructor() {}
}
