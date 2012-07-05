// Generated by CoffeeScript 1.3.3
(function() {
  var isNumber;

  console.log("start_b");

  isNumber = function(o) {
    return !isNaN((o - 0) && o !== null);
  };

  $(function() {
    var edit_data_change, hide_tabs, mean, stats_mdp_change;
    hide_tabs = function(start) {
      var x, _i, _results;
      _results = [];
      for (x = _i = start; start <= 10 ? _i <= 10 : _i >= 10; x = start <= 10 ? ++_i : --_i) {
        _results.push($("#stats_tabs" + x).hide());
      }
      return _results;
    };
    hide_tabs(1);
    stats_mdp_change = function() {
      var selected;
      selected = $(this).val();
      hide_tabs(0);
      return $("#stats_tabs" + selected).show();
    };
    $(".stats_mdp").change(stats_mdp_change);
    mean = function(the_values) {
      var current_mean, current_n_of_samples, n_of_samples, the_mean, total, value, _i, _len;
      total = 0;
      for (_i = 0, _len = the_values.length; _i < _len; _i++) {
        value = the_values[_i];
        total += value;
      }
      the_mean = total / the_values.length;
      the_mean = the_mean.toFixed(2);
      current_mean = parseFloat($("#mean_value").html).toFixed(2);
      if (the_mean !== current_mean) {
        $("#mean_value").html(the_mean).effect("highlight");
      }
      n_of_samples = the_values.length;
      current_n_of_samples = $("#n_of_samples_value").html();
      console.log("cnos:", current_n_of_samples);
      console.log("n_of_samples:", n_of_samples);
      if (n_of_samples !== current_n_of_samples) {
        return $("#n_of_samples_value").html(current_n_of_samples).effect("highlight");
      }
    };
    edit_data_change = function() {
      var checkbox, checked, real_value, row, the_values, value, values, _i, _len;
      the_values = [];
      values = $('#primary').find(".edit_strain_value");
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        real_value = $(value).val();
        row = $(value).closest("tr");
        checkbox = $(row).find(".edit_strain_checkbox");
        checked = $(checkbox).attr('checked');
        if (!checked) {
          console.log("Not checked");
          continue;
        }
        if (isNumber(real_value) && real_value !== "") {
          the_values.push(parseFloat(real_value));
        }
      }
      return mean(the_values);
    };
    $('#primary').change(edit_data_change);
    return console.log("loaded");
  });

}).call(this);
