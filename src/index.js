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

                fullTextSearch: {
                    prefix: 'PREFIX dbo: <http://schema.org/LERMAbook/>\n',
                    queryPattern: `
                          ?inst rdfs:label ?searchLabel.
                          ?searchLabel bif:contains "\${text}".
                          ?inst dbo:wikiPageID ?origScore .
                          BIND(0-?origScore as ?score)
                    `,
                },
                classTreeQuery: `
                    SELECT distinct ?LERMAbook ?label WHERE {
                        ?LERMAbook rdfs:label ?label.
                    }
                `,
                elementInfoQuery: `
                    CONSTRUCT {
                        ?inst rdf:type ?LERMAbook .
                        ?inst rdfs:label ?label .
                        ?inst ?propType ?propValue.
                    } WHERE {
                        VALUES (?inst) {\${ids}}
                        ?inst rdf:type ?LERMAbook .
                        ?inst rdfs:label ?label .
                        FILTER (!contains(str(?LERMAbook), 'http://dbpedia.org/class/yago'))
                        OPTIONAL {?inst ?propType ?propValue.
                        FILTER (isLiteral(?propValue)) }
                    }               
                `,
                filterElementInfoPattern: `
                    OPTIONAL {?inst rdf:type ?foundClass. FILTER (!contains(str(?foundClass), 'http://dbpedia.org/class/yago'))}
                    BIND (coalesce(?foundClass, owl:Thing) as ?class)
                    OPTIONAL {?inst \${dataLabelProperty} ?label}`,
                imageQueryPattern: ` { ?inst ?linkType ?fullImage } UNION { [] ?linkType ?inst. BIND(?inst as ?fullImage) }
                        BIND(CONCAT("https://commons.wikimedia.org/w/thumb.php?f=",
                        STRAFTER(STR(?fullImage), "Special:FilePath/"), "&w=200") AS ?image)
                `,
            }, Ontodia.DBPediaSettings),
        ]),
    });
}


const props = {
    ref: onWorkspaceMounted,
    languages: [{
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
        {
            code: 'ru',
            label: 'Russo'
        },
    ],
    language: 'it',
    viewOptions: {
        onIriClick: ({
            iri
        }) => window.open(iri),
        groupBy: [{
            linkType: 'http://www.researchspace.org/ontology/group',
            linkDirection: 'in'
        }, ],
    },
    typeStyleResolver: types => {
        // if (types.indexOf('http://www.w3.org/2000/01/rdf-schema#Class') !== -1) {
        //     return {
        //         icon: certificateIcon
        //     };
        // } else if (types.indexOf('http://www.w3.org/2002/07/owl#Class') !== -1) {
        //     return {
        //         icon: certificateIcon
        //     };
        // } else if (types.indexOf('http://www.w3.org/2002/07/owl#ObjectProperty') !== -1) {
        //     return {
        //         icon: cogIcon
        //     };
        if (types.indexOf('http://schema.org/LERMAbook') !== -1) {
            return {
                color: '#80040a'
            };
        } else if (types.indexOf('http://www.w3.org/2002/07/owl#LERMATopConcept') !== -1) {
            return {
                color: '#00FF00'
            };
        } else if (types.indexOf('http://www.w3.org/2002/07/owl#LERMAConcept',) !== -1) {
            return {
                color: '#00FF00'
            };
        } else if (types.indexOf('http://www.w3.org/2002/07/owl#LERMAOtherConcept') !== -1) {
            return {
                color: '#00FF00'
            };
        // } else if (types.indexOf('http://www.w3.org/2002/07/owl#DatatypeProperty') !== -1) {
        //     return {
        //         color: '#046380'
        //     };
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