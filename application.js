define(['jquery', 'bootstrap', 'jquery.flowchart', 'jquery.panzoom'], function ($) {
  var $flowchart = $('#flowchart');
  var $container = $flowchart.parent();

  _initializePanzoom($flowchart, $container);

  var $operatorProperties = $('#operatorProperties');
  var $linkProperties = $('#linkProperties');
  var $operatorTitle = $('#operatorTitle');
  var $operatorContent = $('#buildingBlockContent');
  var $linkColor = $('#linkColor');

  var data = {};

  $flowchart.flowchart({
    data: data,
    onOperatorSelect: function(operatorId) {
      $operatorProperties.show();
      $operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));
      $operatorContent.val($flowchart.flowchart('getOperatorContent', operatorId));
      return true;
    },
    onOperatorUnselect: function() {
      $operatorProperties.hide();
      return true;
    },
    onLinkSelect: function(linkId) {
      $linkProperties.show();
      $linkColor.val($flowchart.flowchart('getLinkMainColor', linkId));
      return true;
    },
    onLinkUnselect: function() {
      $linkProperties.hide();
      return true;
    }
  });

  $operatorTitle.keyup(function() {
    var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
    if (selectedOperatorId != null) {
      $flowchart.flowchart('setOperatorTitle', selectedOperatorId, $operatorTitle.val());
    }
  });

  $operatorContent.keyup(function() {
    var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
    if (selectedOperatorId != null) {
      $flowchart.flowchart('setOperatorContent', selectedOperatorId, $operatorContent.val());
    }
  });

  $linkColor.change(function() {
    var selectedLinkId = $flowchart.flowchart('getSelectedLinkId');
    if (selectedLinkId != null) {
      $flowchart.flowchart('setLinkMainColor', selectedLinkId, $linkColor.val());
    }
  });

  $('#deleteSelected').click(function() {
    $flowchart.flowchart('deleteSelected');
  });

  $('#getData').click(function() {
    var data = $flowchart.flowchart('getData');
    $('#flowchartData').val(JSON.stringify(data, null, 2));
  });

  var $draggableOperators = $('.draggable_operator');

  function getOperatorData($element) {
    var nbInputs = parseInt($element.data('nb-inputs'));
    var nbOutputs = parseInt($element.data('nb-outputs'));
    var data = {
      properties: {
        title: $element.text(),
        inputs: {},
        outputs: {}
      }
    };

    var i = 0;
    for (i = 0; i < nbInputs; i++) {
      data.properties.inputs['input_' + i] = {
        label: 'Input ' + (i + 1)
      };
    }
    for (i = 0; i < nbOutputs; i++) {
      data.properties.outputs['output_' + i] = {
        label: 'Output ' + (i + 1)
      };
    }

    return data;
  }

  var operatorId = 0;

  $draggableOperators.draggable({
    cursor: "move",
    opacity: 0.7,
    helper: function(e) {
      var $this = $(this);
      var data = getOperatorData($this);
      return $flowchart.flowchart('getOperatorElement', data).zIndex(3);
    },
    stop: function(e, ui) {
      var $this = $(this);
      var elOffset = ui.offset;
      var containerOffset = $container.offset();
      if (elOffset.left > containerOffset.left &&
        elOffset.top > containerOffset.top &&
        elOffset.left < containerOffset.left + $container.width() &&
        elOffset.top < containerOffset.top + $container.height()) {
        var flowchartOffset = $flowchart.offset();

        var relativeLeft = elOffset.left - flowchartOffset.left;
        var relativeTop = elOffset.top - flowchartOffset.top;

        var positionRatio = $flowchart.flowchart('getPositionRatio');
        relativeLeft /= positionRatio;
        relativeTop /= positionRatio;

        var data = getOperatorData($this);
        data.left = relativeLeft;
        data.top = relativeTop;
        $flowchart.flowchart('createOperator', 'op_' + operatorId, data);
        operatorId++;
      }
    }
  });
});

function _initializePanzoom(flowchart, container) {
  var cx = flowchart.width() / 2;
  var cy = flowchart.height() / 2;

  flowchart.panzoom();
  flowchart.panzoom('pan', -cx + container.width() / 2, -cy + container.height() / 2);
  var possibleZooms = [0.5, 0.75, 1, 2, 3];
  var currentZoom = 2;
  container.on('mousewheel.focal', function(e) {
    e.preventDefault();
    var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
    var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
    currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
    flowchart.flowchart('setPositionRatio', possibleZooms[currentZoom]);
    flowchart.panzoom('zoom', possibleZooms[currentZoom], {
      animate: false,
      focal: e
    });
  });
}