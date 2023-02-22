import Store from 'electron-store';
import cons from './cons';


class AppData {
  constructor() {
    this.store = new Store();
    this.fetchExternalDbConfig = this.fetchExternalDbConfig.bind(this);
    this.handler = this.handler.bind(this);
  }

  fetchExternalDbConfig = () => {
    const config = this.store.get(cons.appData.data.EXTERNAL_DB_CONFIG);
    return config ?? null;
  };

  saveExternalDbConfig = (data) => {
    if (data) {
      try {
        this.store.set(cons.appData.data.EXTERNAL_DB_CONFIG, data);
        return true;
      } catch (err) {
        console.error('Error: failed to save external db config to disk');
        console.error(err);
        return null;
      }
    }
  };

  handler(evt, action) {
    switch (action.type) {
      case 'fetch-external-db-config': return this.fetchExternalDbConfig();
      case 'save-external-db-config': return this.saveExternalDbConfig(action.data);
    }
  }
}

const appData = new AppData();
export default appData.handler;
