export const BOT_STATUS = {
  idle: 'IDLE',
  busy: 'BUSY',
} as const;

type BotStatus = (typeof BOT_STATUS)[keyof typeof BOT_STATUS];

export class Bot {
  status!: BotStatus;
  processingId!: string | null;
  abortController: AbortController;
  signal: AbortSignal;

  constructor() {
    this.status = BOT_STATUS.idle;
    this.processingId = null;
    this.abortController = new AbortController();
    this.signal = this.abortController.signal;
  }

  async processOrder(id: string) {
    this.status = BOT_STATUS.busy;
    this.processingId = id;
    const done = () =>
      new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 1000 * 5);

        this.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject();
        });
      });
    await done();
    this.processingId = null;
    this.status = BOT_STATUS.idle;
    return id;
  }

  async cancelProcess() {
    this.abortController.abort();
  }
}
