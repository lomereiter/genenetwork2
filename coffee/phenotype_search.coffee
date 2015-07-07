APP_ID = "A6LX075BLV"
SEARCH_ONLY_API_KEY = "164c63eedb7efb07d13443812d592944"
INDEX_NAME = "phenotype"
HITS_PER_PAGE = 50

$ ->
    algolia = algoliasearch APP_ID, SEARCH_ONLY_API_KEY

    numericFields = ['LRS', 'Mb', 'Year', 'additive']
    params =
        hitsPerPage: HITS_PER_PAGE
        advancedSyntax: true
#        disjunctiveFacets: numericFields

    algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, params)

    $("#q").on 'keyup', () =>
        query = $("#q").val()
        algoliaHelper.setQuery(query).search()
        
    algoliaHelper.on 'result', (content, state) =>
        renderHits content

    $("#q").focus()
    hitTemplate = Hogan.compile $('#hit-template').text()

    renderHits = (content) ->
        hitsHtml = '<table id="trait_table">'
        header_fields = ['Record ID', 'Description', 'Authors', 'Year',
                         'LRS', 'LRS location', 'Additive effect']
        header = ('<th>' + x + '</th>' for x in header_fields).join('')
        hitsHtml += '<thead><tr>' + header + '</tr></thead><tbody>'
        for hit, i in content.hits
            hit.description = hit._highlightResult.Post_publication_description.value
            hit.LRS = parseFloat hit.LRS.toFixed(3)
            if hit.Mb > 1e6
                hit.Mb /= 1e6
            hit.LRS_location = "Chr #{hit.Chr}: #{hit.Mb.toFixed(6)} Mb"
            hit.additive = hit.additive.toFixed(3)
            hitsHtml += hitTemplate.render hit
        hitsHtml += '</tbody></table>'
        if content.hits.length == 0
            hitsHtml = '<p id="no-hits">We didn\'t find any phenotypes for your search.</p>'
        $("#hits").html(hitsHtml)
        $('#trait_table').dataTable({
          columns: [
              #{ bSortable: false },
              { type: "num", swidth: "5%" },
              { sWidth: "35%"  },
              { sWidth: "15%"  },
              { type: "num" }, # year
              { type: "num" }, # LRS
              { type: "natural"  }, # LRS Location
              { type: "num"  } # Additive effect
            ],
          sDom: "tir",
          iDisplayLength: -1,
          autoWidth: true,
          bLengthChange: true,
          bDeferRender: true,
          bSortClasses: false
        })

