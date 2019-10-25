var React = require('react');
var ReactDOM = require('react-dom');
var Ontodia = require('ontodia')

//require('jointjs/css/layout.css');
//require('jointjs/css/themes/default.css');

function onWorkspaceMounted(workspace) {
  if (!workspace) {
    return;
  }

  const model = workspace.getModel();

  // model.graph.on('action:iriClick', (iri) => {
  //     window.open(iri);
  //     console.log(iri);
  // });

  //c'è un modo di fare la ricerca solo sullo sparql endpoint locale???
  //vedere l'integrazione del codice!!!
  //modularizzazione react macrocomponenti 1 ontodia 2 libreria etc.

  model.importLayout({
    validateLinks: true,
    dataProvider: new Ontodia.CompositeDataProvider([
      new Ontodia.SparqlDataProvider({
        endpointUrl: '/sparql-endpoint',
        queryMethod: Ontodia.SparqlQueryMethod.GET
      }, Ontodia.OWLStatsSettings),
      new Ontodia.SparqlDataProvider({
        endpointUrl: 'http://dbpedia.org/sparql',
        imagePropertyUris: [
          'http://xmlns.com/foaf/0.1/depiction',
          'http://xmlns.com/foaf/0.1/img',
        ],
        queryMethod: Ontodia.SparqlQueryMethod.GET,
      }, Ontodia.DBPediaSettings),
    ],
    {
      mergeMode: 'sequentialFetching' ,
    },
    ),
  });
}

const props = {
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
    // {
    //     code: 'de',
    //     label: 'Tedesco'
    // },
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
    // groupBy: [{
    //     linkType: 'http://www.researchspace.org/ontology/group',
    //     linkDirection: 'in'
    // }, ],
    
  },
  typeStyleResolver: types => {
    //BOOK
    if (types.indexOf('http://lerma.example.org/book') !== -1) {
      return {
        color: '#80040a'
      };
      //CONCEPT
    } else if (types.indexOf('http://lerma.example.org/concept') !== -1) {
      return {
        color: '#00961c'
      };
      //METADATA
    } else if (types.indexOf('http://lerma.example.org/metadata/YearPublication') !== -1) {
      return {
        color: '#A9A9A9'
      };
    } else if (types.indexOf('http://lerma.example.org/metadata/Chronology') !== -1) {
      return {
        color: '#A9A9A9'
      };
    } else if (types.indexOf('http://lerma.example.org/metadata/Topic') !== -1) {
      return {
        color: '#A9A9A9'
      };
    } else if (types.indexOf('http://lerma.example.org/metadata/Typology') !== -1) {
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

//stato dell'elemento in comune.. sapere la risorsa selezionata
//stato risorsa selezionata
// quando in ontodia viene visualizzata una nuova risorsa cambia questo stato... 
// a seconda della risorsa selezionata visualizza i risultati corrispondenti.
// tutorial come integrare più componenti come comporre a partire da un componente

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
  ReactDOM.render(React.createElement(Ontodia.Workspace, props), container)
});