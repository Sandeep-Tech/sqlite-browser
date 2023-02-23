class Monitor {
  constructor() {

  }

  monitor() {
    // 1. check for config
    // 3. check for monitoring criteria
    // 2. connect to the external db
    // 4. check if the table criteria.tablename exists in external db
    // 5. fetch this info (criteria.tablename in config.servername) from the internal db
  }
}

const monitor = new Monitor();
export default monitor.monitor;
