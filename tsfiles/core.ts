//const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
const configDefault: any = { attributes: true, childList: true, characterData: true };

interface ICallback {
    domEvent: string;
    callback: any;
}

interface IVDom {
    virtual: HTMLDocument;
    Callbacks: ICallbacks;
    arrayCallbacks: Array<ICallback>;
}

interface VDom {
    setHtml: Function;
    getHtml: Function;
}

interface ICallbacks {
    attribModifiedCallback: Function;
    attribNameChangedCallback: Function;
    characterDataModifiedCallback: Function;
    elementNameChangedCallback: Function;
    nodeInsertedIntoDocumentCallback: Function;
    nodeInsertedCallback: Function;
    nodeRemovedCallback: Function;
    removedFromDocumentCallback: Function;
    subtreeModifiedCallback: Function;
}

const createDOM = (stringTemplate: string = `<!doctype html><html><head></head><body></body></html>`, format: string = "text/html"): HTMLDocument => {
    let dom = new DOMParser();

    return dom.parseFromString(stringTemplate, format) as HTMLDocument;
};

const applyDocument = (doc: HTMLDocument): void => {
    if (doc) {
        document.body.innerHTML = doc.body.innerHTML;
    }
};

class VDom implements IVDom {

    private _template: string;
    private _format: string;
    virtual: HTMLDocument;
    Callbacks: ICallbacks;
    arrayCallbacks: Array<ICallback>;

    constructor(public template: string = ``, public format: string = 'text/html') {
        this._template = template;
        this._format = format;

        this.virtual = createDOM(this._template, this._format);

        this.Callbacks = {

            attribModifiedCallback: (event: MutationEvent): any => {

            },
            attribNameChangedCallback: (event: MutationEvent): any => {

            },
            characterDataModifiedCallback: (event: MutationEvent): any => {

            },
            elementNameChangedCallback: (event: MutationEvent): any => {

            },
            nodeInsertedIntoDocumentCallback: (event: MutationEvent): any => {

            },
            nodeInsertedCallback: (event: MutationEvent): any => {

            },
            nodeRemovedCallback: (event: MutationEvent): any => {

            },
            removedFromDocumentCallback: (event: MutationEvent): any => {

            },
            subtreeModifiedCallback: (event: MutationEvent): any => {

            },
        };

        this.arrayCallbacks = [{ domEvent: 'DOMAttrModified', callback: { DOMAttrModified: this.Callbacks.attribModifiedCallback } },
        { domEvent: 'DOMAttributeNameChanged', callback: { DOMAttributeNameChanged: this.Callbacks.attribNameChangedCallback } },
        { domEvent: 'DOMCharacterDataModified', callback: { DOMCharacterDataModified: this.Callbacks.characterDataModifiedCallback } },
        { domEvent: 'DOMElementNameChanged', callback: { DOMElementNameChanged: this.Callbacks.elementNameChangedCallback } },
        { domEvent: 'DOMNodeInsertedIntoDocument', callback: { DOMNodeInsertedIntoDocument: this.Callbacks.nodeInsertedIntoDocumentCallback } },
        { domEvent: 'DOMNodeInserted', callback: { DOMNodeInserted: this.Callbacks.nodeInsertedCallback } },
        { domEvent: 'DOMNodeRemoved', callback: { DOMNodeRemoved: this.Callbacks.nodeRemovedCallback } },
        { domEvent: 'DOMNodeRemovedFromDocument', callback: { DOMNodeRemovedFromDocument: this.Callbacks.removedFromDocumentCallback } },
        { domEvent: 'DOMSubtreeModified', callback: { DOMSubtreeModified: this.Callbacks.subtreeModifiedCallback } }];

        this.configureCallback(this.virtual);
    }

    private configureCallback(doc: HTMLDocument): void {
        if (this.virtual) {
            this.arrayCallbacks.forEach(event => {
                this.virtual.addEventListener((event as ICallback).domEvent, (mutationEvent: MutationEvent): void => {
                    (event as ICallback).callback[event.domEvent](doc, mutationEvent);
                });
            });
        }
    }

    public apply(): void {
        document.body.innerHTML = this.virtual.body.innerHTML;

        return;
    }

    public getCallback(eventName: string) : ICallback {
        this.arrayCallbacks.forEach(e => {
            if(e && e.domEvent == eventName){
                return e;
            }
        });

        return null;
    }

    public body() : VDom {

        let body = this.virtual.body as any;

        body.setHtml = (stringTemplate: string) : void => {
            body.innerHTML = stringTemplate;

            return;
        };

        body.getHtml = () : string => {
            return body.innerHTML;
        };

        return body;
    }
}

//Router
window.onhashchange = () : void => {
    let hash = window.location.hash;
};

//Ready
document.addEventListener('DOMContentLoaded', (): void => {

    //Set up this document
    let virtual = new VDom();

    virtual.getCallback('DOMNodeInserted').callback = (event: MutationEvent) => {
        console.log("New item added", event);
    };

    virtual.body().setHtml(`<h1>TEST</h1>`);
});