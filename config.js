require.config({
  // baseUrl: '/js',
  paths: {
    "bootstrap": './vendor/bootstrap',
    "jquery": './vendor/jquery',
    "jquery-ui": './vendor/jquery-ui',
    "jquery.flowchart": './vendor/sdrdis-jquery.flowchart/jquery.flowchart',
    "jquery.panzoom": './vendor/jquery.panzoom.min'
  },
  shim: {
    "bootstrap": {
      deps: ['jquery'],
      exports: '$.fn.popover'
    },
    "jquery-ui": {
      deps: ['jquery'],
      exports: '$.ui'
    },
    "jquery.flowchart": {
      deps: ['jquery', 'jquery-ui'],
      exports: '$.flowchart'
    },
    "jquery.panzoom": {
      deps: ['jquery'],
      exports: '$.panzoom'
    }
  }
});

require(['./application']);