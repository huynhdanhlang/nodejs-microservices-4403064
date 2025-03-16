const { satisfies } = require("semver");

class Registry {
  constructor() {
    this.services = [];
    this.timeout = 15;
  }

  getKey(name, version, ip, port) {
    return name + version + ip + port;
  }

  get(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services).filter((serv) => {
      return serv.name === name && satisfies(serv.version, version);
    });

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        console.log(`Removed expired service: ${key}`);
      }
    });
  }

  register(name, version, ip, port) {
    this.cleanup();
    const key = this.getKey(name, version, ip, port);

    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);

      this.services[key].ip = ip;
      this.services[key].port = port;
      this.services[key].name = name;
      this.services[key].version = version;

      console.log(`Added services ${name}, ${version} at ${ip}:${port}`);
    }
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    console.log(`Updated services ${name}, ${version} at ${ip}:${port}`);

    return key;
  }

  unregister(name, version, ip, port) {
    const key = this.getKey(name, version, ip, port);

    delete this.services[key];

    return key;
  }
}

module.exports = Registry;
