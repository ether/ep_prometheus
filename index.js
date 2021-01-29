'use strict';

const stats = require('ep_etherpad-lite/node/stats');

exports.expressCreateServer = (hookName, args, cb) => {
  args.app.get('/metrics', (req, res) => {
    let response = '';
    const flattened = flatten(stats.toJSON());
    for (const [key, value] of Object.entries(flattened)) {
      response += `# HELP ${key} Some Etherpad related data\n`;
      response += `# TYPE ${key} gauge\n`;
      response += `# ${key} ${value}\n\n`;
    }
    res.setHeader('content-type', 'text/plain');
    res.send(response);
  });
  cb();
};

const flatten = (obj, parent, res = {}) => {
  for (const key in obj) {
    const propName = parent ? `${parent}_${key}` : key;
    if (typeof obj[key] === 'object') {
      flatten(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
};
