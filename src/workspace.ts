import { Component, createElement, ReactElement, cloneElement } from 'react';
import * as ReactDOM from 'react-dom';
import * as saveAs from 'file-saverjs';

import { Workspace } from 'ontodia';

import { Rect } from 'ontodia';
import { PaperArea } from 'ontodia';

import { dataURLToBlob } from 'ontodia';

import { WorkspaceMarkup, WorkspaceMarkupProps } from 'ontodia';
import { WorkspaceEventKey } from 'ontodia';

export class ArcaWorkspace extends Workspace {

    private markup: WorkspaceMarkup;

    _getPaperArea(): PaperArea | undefined {
        return this.markup ? this.markup.paperArea : undefined;
    }

    render(): ReactElement<any> {
        const {
            hidePanels, hideToolbar, metadataApi, hideScrollBars, onWorkspaceEvent,
            _elementsSearchPanel,
        } = this.props;
        return createElement(WorkspaceMarkup, {
            ref: markup => { this.markup = markup; },
            hidePanels,
            hideToolbar,
            hideScrollBars,
            model: this.model,
            view: this.view,
            editor: this.editor,
            metadataApi,
            leftPanelInitiallyOpen: this.props.leftPanelInitiallyOpen,
            rightPanelInitiallyOpen: this.props.rightPanelInitiallyOpen,
            searchCriteria: this.state.criteria,
            onSearchCriteriaChanged: criteria => this.setState({criteria}),
            zoomOptions: this.props.zoomOptions,
            onZoom: this.props.onZoom,
            isLeftPanelOpen: this.props.leftPanelInitiallyOpen,
            isRightPanelOpen: this.props.rightPanelInitiallyOpen,
            toolbar: createElement(ToolbarWrapper, {workspace: this}),
            onWorkspaceEvent,
            watermarkSvg: this._watermarkSvg,
            watermarkUrl: this._watermarkUrl,
            elementsSearchPanel: _elementsSearchPanel,
        } as WorkspaceMarkupProps & React.ClassAttributes<WorkspaceMarkup>);
    }

    componentDidMount() {
        const {onWorkspaceEvent} = this.props;

        this.editor._initializePaperComponents(this.markup.paperArea);
        this.updateNavigator(!this.props.hideNavigator);

        this.listener.listen(this.model.events, 'loadingSuccess', () => {
            this.view.performSyncUpdate();
            this.markup.paperArea.centerContent();
        });

        this.listener.listen(this.model.events, 'elementEvent', ({key, data}) => {
            if (!data.requestedAddToFilter) { return; }
            const {source, linkType, direction} = data.requestedAddToFilter;
            this.setState({
                criteria: {
                    refElement: source,
                    refElementLink: linkType,
                    linkDirection: direction,
                },
            });
            if (onWorkspaceEvent) {
                onWorkspaceEvent(WorkspaceEventKey.searchUpdateCriteria);
            }
        });

        this.listener.listen(this.markup.paperArea.events, 'pointerUp', e => {
            if (this.props.onPointerUp) {
                this.props.onPointerUp(e);
            }
        });
        this.listener.listen(this.markup.paperArea.events, 'pointerMove', e => {
            if (this.props.onPointerMove) {
                this.props.onPointerMove(e);
            }
        });
        this.listener.listen(this.markup.paperArea.events, 'pointerDown', e => {
            if (this.props.onPointerDown) {
                this.props.onPointerDown(e);
            }
        });

        if (onWorkspaceEvent) {
            this.listener.listen(this.editor.events, 'changeSelection', () =>
                onWorkspaceEvent(WorkspaceEventKey.editorChangeSelection)
            );
            this.listener.listen(this.editor.events, 'toggleDialog', () =>
                onWorkspaceEvent(WorkspaceEventKey.editorToggleDialog)
            );
            this.listener.listen(this.editor.events, 'addElements', () =>
                onWorkspaceEvent(WorkspaceEventKey.editorAddElements)
            );
        }
    }

    preventTextSelectionUntilMouseUp() { this.markup.preventTextSelection(); }

    zoomToFit = () => {
        this.markup.paperArea.zoomToFit();
    }

    zoomToFitRect = (bbox: Rect) => {
        this.markup.paperArea.zoomToFitRect(bbox);
    }

    showWaitIndicatorWhile(operation: Promise<any>) {
        this.markup.paperArea.centerTo();
        this.editor.setSpinner({});
        if (operation) {
            operation.then(() => {
                this.editor.setSpinner(undefined);
            }).catch(error => {
                // tslint:disable-next-line:no-console
                console.error(error);
                this.editor.setSpinner({statusText: 'Unknown error occured', errorOccured: true});
            });
        }
    }

    exportSvg = (fileName?: string) => {
        this.markup.paperArea.exportSVG().then(svg => {
            fileName = fileName || 'diagram.svg';
            const xmlEncodingHeader = '<?xml version="1.0" encoding="UTF-8"?>';
            const blob = new Blob([xmlEncodingHeader + svg], {type: 'image/svg+xml'});
            saveAs(blob, fileName);
        });
    }

    exportPng = (fileName?: string) => {
        fileName = fileName || 'diagram.png';
        this.markup.paperArea.exportPNG({backgroundColor: 'white'}).then(dataUri => {
            const blob = dataURLToBlob(dataUri);
            saveAs(blob, fileName);
        });
    }

    zoomBy = (value: number) => {
        this.markup.paperArea.zoomBy(value);
    }

    zoomIn = () => {
        this.markup.paperArea.zoomIn();
    }

    zoomOut = () => {
        this.markup.paperArea.zoomOut();
    }

    print = () => {
        this.markup.paperArea.exportSVG().then(svg => {
            const printWindow = window.open('', undefined, 'width=1280,height=720');
            printWindow.document.write(svg);
            printWindow.document.close();
            printWindow.print();
        });
    }

    centerTo = (paperPosition?: { x: number; y: number }) => {
        this.markup.paperArea.centerTo(paperPosition);
    }
}
