
import { selectAllFromChoosenTable as selectAllFromChoosenTableInExtDb } from "./externalDb";
import { fetchMonitoringCriteria } from "./appData";
import internalDb from "./internalDb";

class Monitor {
  constructor() {
    this.monitor = this.monitor.bind(this);
    this.monitorIntervalId = null;
    this.broadcaster = null;
  }

  setBroadcaster = (cb) => {
    this.broadcaster = cb;
  }

  stopMonitor = () => {
    if (this.monitorIntervalId) clearInterval(this.monitorIntervalId);
  }

  async monitor() {
    const monitoringCriteria = fetchMonitoringCriteria();
    if (monitoringCriteria) {
      this.monitorIntervalId = setInterval(
        async  () => {
          const tableDataFromExtDb = await selectAllFromChoosenTableInExtDb();
          await internalDb.saveToChoosenTable(tableDataFromExtDb);      
          const table = await internalDb.fetchTable();
          if (this.broadcaster) this.broadcaster(table);
        },
        monitoringCriteria.queryrate * 1000,
      )
    }

  }
}

const monitor = new Monitor();
export default monitor;
