import { selectAllFromChoosenTable as selectAllFromChoosenTableInExtDb } from "./externalDb";
import internalDb from "./internalDb";

class Monitor {
  constructor() {}

  async monitor() {
    const tableDataFromExtDb = await selectAllFromChoosenTableInExtDb();
    internalDb.saveToChoosenTable(tableDataFromExtDb);
  }
}

const monitor = new Monitor();
export default monitor.monitor;
