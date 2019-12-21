var React = require('react');
var ReactDOM = require('react-dom');
var Ontodia = require('@eleonoraai/ontodia-arca');

function onWorkspaceMounted(workspace) {
  if (!workspace) {
    return;
  }

  const model = workspace.getModel();
  

  model.importLayout({
    diagram: Ontodia.makeSerializedDiagram({
      linkTypeOptions: 
      [
        {
          '@type': 'LinkTypeOptions',
          property: "http://dbpedia.org/ontology/wikiPageWikiLink",
          visible: false,
        },
        {
          '@type': 'LinkTypeOptions',
          property: "http://dbpedia.org/ontology/associate",
          visible: false,
        },
        {
          '@type': 'LinkTypeOptions',
          property: "http://www.w3.org/2000/01/rdf-schema#seeAlso",
          visible: false,
        },
        {
          '@type': 'LinkTypeOptions',
          property: "http://dbpedia.org/ontology/wikiPageEternalLink",
          visible: false,
        },
      ], 
    }),
    validateLinks: true,
    mergeMode: 'sequentialFetching' ,
    dataProvider: new Ontodia.CompositeDataProvider([
      new Ontodia.SparqlDataProvider({
        endpointUrl: '/sparql-endpoint',
        queryMethod: Ontodia.SparqlQueryMethod.GET
      }, Ontodia.OWLStatsSettings),

      new Ontodia.SparqlDataProvider({
        endpointUrl: '/wikidata',
        imagePropertyUris: [
          'http://xmlns.com/foaf/0.1/depiction',
          'http://xmlns.com/foaf/0.1/img',
        ],
        queryMethod: Ontodia.SparqlQueryMethod.POST,
      }, Ontodia.WikidataSettings),

      new Ontodia.SparqlDataProvider({
        endpointUrl: 'http://dbpedia.org/sparql',
        imagePropertyUris: [
          'http://xmlns.com/foaf/0.1/depiction',
          'http://xmlns.com/foaf/0.1/img',
        ],
        queryMethod: Ontodia.SparqlQueryMethod.GET,
      }, Ontodia.DBPediaSettings),
    ],
    ),
  });
}


const props = {
  leftPanelInitiallyOpen: true,
  ref: onWorkspaceMounted,

  languages: [
    {
      code: 'it',
      label: 'Italiano'
    },
    {
      code: 'en',
      label: 'Inglese'
    },
    {
        code: 'de',
        label: 'Tedesco'
    },
    // {
    //     code: 'ru',
    //     label: 'Russo'
    // },
  ],
  language: 'it',
  viewOptions: {
    onIriClick: ({
      iri
    }) => window.open(iri),
  },


  typeStyleResolver: types => {
    //BOOK
    if (types.indexOf('http://lerma.org/Book') !== -1) {
      return {
        color: '#80040a',
        icon: '../images/lerma_logo.png'
        // background: '#ffff3b',
        // icon: logo_lerma
      };
      //CONCEPT
    } else if (types.indexOf('http://lerma.org/Concept') !== -1) {
      return {
        color: '#00961c',

      };
      //METADATA
    } else if (types.indexOf('http://lerma.org/metadata/YearPublication') !== -1) {
      return {
        color: '#A9A9A9'
      };
    } else if (types.indexOf('http://lerma.org/metadata/Chronology') !== -1) {
      return {
        color: '#A9A9A9'
      };
    } else if (types.indexOf('http://lerma.org/metadata/Topic') !== -1) {
      return {
        color: '#A9A9A9'
      };
    } else if (types.indexOf('http://lerma.org/metadata/Typology') !== -1) {
      return {
        color: '#A9A9A9'
      };
    } else {
      return {
        color: '#046380'
      };
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(Ontodia.Workspace, props), container)
});