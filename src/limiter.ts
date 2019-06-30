export default class Limiter {
  /*
        @param getId (request) => id
    */
   getId;
   requestsCounter;
   deniedIds;
   options;
  constructor(getId, options) {
    this.getId = getId;
    this.requestsCounter = {};
    this.deniedIds = [];
    this.options = options;
    setInterval(() => {
      Object.keys(this.requestsCounter).forEach(key => {
        this.requestsCounter[key] = 0;
      });
    }, options.saveTime);
  }

  checkRequest(request) {
    const id = this.getId(request);
    if (
      id &&
      this.requestsCounter[id] &&
      this.requestsCounter[id] > this.options.limit
    ) {
      const deniedIndex = this.deniedIds.indexOf(id);
      if (deniedIndex === -1) {
        this.deniedIds.push(id);
        console.log(`Blocked - ${id}`);
        setTimeout(() => {
          this.requestsCounter[id] = 0;
          this.deniedIds.splice(this.deniedIds - 1, 1);
          console.log(`Unblocked - ${id}`);
        }, this.options.denyTime);
      }
      return false;
    }
    this.incCounter(id);
    return true;
  }

  incCounter(id) {
    if (this.requestsCounter[id]) {
      this.requestsCounter[id]++;
    } else {
      this.requestsCounter[id] = 1;
    }
    console.log(`${id} ${this.requestsCounter[id]}`)

  }
}