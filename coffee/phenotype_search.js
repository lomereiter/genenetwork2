// Generated by CoffeeScript 1.9.2
(function() {
  var APP_ID, HITS_PER_PAGE, INDEX_NAME, SEARCH_ONLY_API_KEY;

  APP_ID = "A6LX075BLV";

  SEARCH_ONLY_API_KEY = "164c63eedb7efb07d13443812d592944";

  INDEX_NAME = "phenotype";

  HITS_PER_PAGE = 50;

  $(function() {
    var algolia, algoliaHelper, hitTemplate, numericFields, params, renderHits;
    algolia = algoliasearch(APP_ID, SEARCH_ONLY_API_KEY);
    numericFields = ['LRS', 'Mb', 'Year', 'additive'];
    params = {
      hitsPerPage: HITS_PER_PAGE,
      advancedSyntax: true
    };
    algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, params);
    $("#q").on('keyup', (function(_this) {
      return function() {
        var query;
        query = $("#q").val();
        return algoliaHelper.setQuery(query).search();
      };
    })(this));
    algoliaHelper.on('result', (function(_this) {
      return function(content, state) {
        return renderHits(content);
      };
    })(this));
    $("#q").focus();
    hitTemplate = Hogan.compile($('#hit-template').text());
    return renderHits = function(content) {
      var header, header_fields, hit, hitsHtml, i, j, len, ref, x;
      hitsHtml = '<table id="trait_table">';
      header_fields = ['Record ID', 'Description', 'Authors', 'Year', 'LRS', 'LRS location', 'Additive effect'];
      header = ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = header_fields.length; j < len; j++) {
          x = header_fields[j];
          results.push('<th>' + x + '</th>');
        }
        return results;
      })()).join('');
      hitsHtml += '<thead><tr>' + header + '</tr></thead><tbody>';
      ref = content.hits;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        hit = ref[i];
        hit.description = hit._highlightResult.Post_publication_description.value;
        hit.LRS = parseFloat(hit.LRS.toFixed(3));
        if (hit.Mb > 1e6) {
          hit.Mb /= 1e6;
        }
        hit.LRS_location = "Chr " + hit.Chr + ": " + (hit.Mb.toFixed(6)) + " Mb";
        hit.additive = hit.additive.toFixed(3);
        hitsHtml += hitTemplate.render(hit);
      }
      hitsHtml += '</tbody></table>';
      if (content.hits.length === 0) {
        hitsHtml = '<p id="no-hits">We didn\'t find any phenotypes for your search.</p>';
      }
      $("#hits").html(hitsHtml);
      return $('#trait_table').dataTable({
        columns: [
          {
            type: "num",
            swidth: "5%"
          }, {
            sWidth: "35%"
          }, {
            sWidth: "15%"
          }, {
            type: "num"
          }, {
            type: "num"
          }, {
            type: "natural"
          }, {
            type: "num"
          }
        ],
        sDom: "tir",
        iDisplayLength: -1,
        autoWidth: true,
        bLengthChange: true,
        bDeferRender: true,
        bSortClasses: false
      });
    };
  });

}).call(this);
