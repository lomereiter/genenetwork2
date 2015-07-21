APP_ID = "A6LX075BLV"
SEARCH_ONLY_API_KEY = "164c63eedb7efb07d13443812d592944"
INDEX_NAME = "phenotype"
HITS_PER_PAGE = 50

class Search
    constructor: ->
        @hitTemplate = Hogan.compile $('#hit-template').text()

    hits: (content) -> # implemented in subclasses

    onSuccess: (content) ->
        @renderHits(content)
        $("#filter").css('background-color', '#fff')

    onError: (err) ->
        console.log err
        $("#filter").css('background-color', '#fdd')

    renderHits: (content) ->
        hitsHtml = '<table id="trait_table">'
        header_fields = ['Record ID', 'Description', 'Authors', 'Year',
                         'LRS', 'LRS location', 'Additive effect']
        header = ('<th>' + x + '</th>' for x in header_fields).join('')
        hitsHtml += '<thead><tr>' + header + '</tr></thead><tbody>'
        for hit, i in @hits(content)
            hitsHtml += @hitTemplate.render hit
        hitsHtml += '</tbody></table>'
        if content.hits.length == 0
            hitsHtml = '<p id="no-hits">We didn\'t find any phenotypes for your search.</p>'
        $("#hits").html(hitsHtml)
        $('#trait_table').dataTable({
          columns: [
              #{ bSortable: false },
              { type: "num", swidth: "5%" },
              { sWidth: "35%"  },
              { sWidth: "20%"  },
                null,
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

class AlgoliaSearch extends Search
    constructor: ->
        super
        @client = algoliasearch APP_ID, SEARCH_ONLY_API_KEY
        @pheno_index = @client.initIndex(INDEX_NAME)

        @params =
            hitsPerPage: HITS_PER_PAGE
            advancedSyntax: true

    performSearch: () ->
        query = $("#q").val()
        query_params = $.extend({}, @params) # clone
        query_params.numericFilters = $("#filter").val()
        @pheno_index.search(query, query_params).then((c) => @onSuccess(c))\
                                                .catch((e) => @onError(e))

    hits: (content) ->
        h = []
        for hit in content.hits
            hit.description = hit._highlightResult.Post_publication_description.value
            hit.LRS = parseFloat hit.LRS.toFixed(3)
            if hit.Mb > 1e6
                hit.Mb /= 1e6
            hit.LRS_location = "Chr #{hit.Chr}: #{hit.Mb.toFixed(6)} Mb"
            try
                hit.additive = parseFloat(hit.additive).toFixed(3)
            catch e
                hit.additive = null
            h.push(hit)
        h

$ ->
    client = new AlgoliaSearch

    $("#q").on 'keyup', () =>
        client.performSearch()

    $("#filter").on 'keyup', () =>
        client.performSearch()

    $("#q").focus()
