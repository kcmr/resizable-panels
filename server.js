'use strict';

const path = require('path');
const bs = require('browser-sync').create();
const component = path.basename(__dirname);
const componentPath = `/components/${component}`;
const componentDemoPath = `components/${component}/demo/index.html`;
const config = {
  server: {
    baseDir: '.',
    index: 'index.html',
    routes: {
      componentPath: '.',
      '/components': 'bower_components'
    }
  },
  startPath: componentDemoPath,
  open: false,
  notify: false,
  ghostMode: false,
  ui: false
};

bs.watch('**/*.html').on('change', bs.reload);
bs.init(config);
