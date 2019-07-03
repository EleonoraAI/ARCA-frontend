var React = require('react');
var ReactDOM = require('react-dom');

var Ontodia = require('ontodia')

//require('jointjs/css/layout.css');
//require('jointjs/css/themes/default.css');

function onWorkspaceMounted(workspace) {
    if (!workspace) { return; }

    const model = workspace.getModel();
    // model.graph.on('action:iriClick', (iri) => {
    //     window.open(iri);
    //     console.log(iri);
    // });

    model.importLayout({
        validateLinks: true,
        dataProvider: new Ontodia.SparqlDataProvider({
            endpointUrl: '/sparql-endpoint',
            imagePropertyUris: [
                'http://collection.britishmuseum.org/id/ontology/PX_has_main_representation',
                'http://xmlns.com/foaf/0.1/img',
            ],
        }, Ontodia.OWLStatsSettings),
    });
}

const props = {
    ref: onWorkspaceMounted,
};

 document.addEventListener('DOMContentLoaded', () => {
        const container = document.createElement('div');
        container.id = 'root';
        document.body.appendChild(container);
        ReactDOM.render(React.createElement(Ontodia.Workspace, props), container)
    });
