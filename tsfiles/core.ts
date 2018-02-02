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

    public getCallback(eventName: string): Function {
        for (let i in this.arrayCallbacks) {
            if (this.arrayCallbacks[i].domEvent == eventName) {
                return this.arrayCallbacks[i].callback[eventName] as Function;
            }
        }

        return null;
    }

    public setCallback(eventName: string, func: Function): void {
        for (let i in this.arrayCallbacks) {
            if (this.arrayCallbacks[i].domEvent == eventName) {
                this.arrayCallbacks[i].callback[eventName] = func;
            }
        }

        return;
    }

    public body(): VDom {

        let body = this.virtual.body as any;

        body.setHtml = (stringTemplate: string): void => {
            body.innerHTML = stringTemplate;

            return;
        };

        body.getHtml = (): string => {
            return body.innerHTML;
        };

        return body;
    }
}

//TEST para route
class HashHandler {
    oldHash: any;
    Check: any;

    constructor() {
        this.oldHash = window.location.hash;
        this.Check;
    }

    detect(): any {
        if (this.oldHash != window.location.hash) {
            alert("HASH CHANGED - new has" + window.location.hash);
            this.oldHash = window.location.hash;
        }
    }
}

((): void => {
    // A hash to store our routes:
    let routes: any = {};
    // An array of the current route's events:
    let events: any = [];
    // The element where the routes are rendered:
    let el: any = null;
    // Context functions shared between all controllers:
    let ctx = {
        on: (selector: string, evt: any, handler: any): void => {
            events.push([selector, evt, handler]);
        },
        refresh: (listeners: any[]): void => {
            listeners.forEach(function (fn) { fn(); });
        }
    };

    // Defines a route:
    let route = (path: string, templateId: any, controller: any): void => {
        if (typeof templateId === 'function') {
            controller = templateId;
            templateId = null;
        }

        let listeners: any = [];
        Object.defineProperty(controller.prototype, '$on', { value: ctx.on });
        Object.defineProperty(controller.prototype, '$refresh', { value: ctx.refresh.bind(undefined, listeners) });

        routes[path] = { templateId: templateId, controller: controller, onRefresh: listeners.push.bind(listeners) };
    };

    const forEachEventElement = (fnName: string): void => {
        for (let i = 0, len = events.length; i < len; i++) {
            let els = el.querySelectorAll(events[i][0]);
            for (let j = 0, elsLen = els.length; j < elsLen; j++) {
                els[j][fnName].apply(els[j], events[i].slice(1));
            }
        }
    };

    const addEventListeners = (): void => {
        forEachEventElement('addEventListener');
    };

    const removeEventListeners = (): void => {
        forEachEventElement('removeEventListener');
    };

    //Watch changes on the View
    const calls = {
        attribModifiedCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        attribNameChangedCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        characterDataModifiedCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        elementNameChangedCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        nodeInsertedIntoDocumentCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        nodeInsertedCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        nodeRemovedCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        removedFromDocumentCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
        subtreeModifiedCallback: (element: HTMLElement, event: MutationEvent): void => {

        },
    };

    let arrayCallbacks: Array<ICallback> = [{ domEvent: 'DOMAttrModified', callback: { DOMAttrModified: calls.attribModifiedCallback } },
    { domEvent: 'DOMAttributeNameChanged', callback: { DOMAttributeNameChanged: calls.attribNameChangedCallback } },
    { domEvent: 'DOMCharacterDataModified', callback: { DOMCharacterDataModified: calls.characterDataModifiedCallback } },
    { domEvent: 'DOMElementNameChanged', callback: { DOMElementNameChanged: calls.elementNameChangedCallback } },
    { domEvent: 'DOMNodeInsertedIntoDocument', callback: { DOMNodeInsertedIntoDocument: calls.nodeInsertedIntoDocumentCallback } },
    { domEvent: 'DOMNodeInserted', callback: { DOMNodeInserted: calls.nodeInsertedCallback } },
    { domEvent: 'DOMNodeRemoved', callback: { DOMNodeRemoved: calls.nodeRemovedCallback } },
    { domEvent: 'DOMNodeRemovedFromDocument', callback: { DOMNodeRemovedFromDocument: calls.removedFromDocumentCallback } },
    { domEvent: 'DOMSubtreeModified', callback: { DOMSubtreeModified: calls.subtreeModifiedCallback } }];

    const compare = (data: any): boolean => {
        if (sessionStorage && sessionStorage.currentDocument) {
            let obj = sessionStorage.currentDocument || {};
            let dom = sessionStorage.currentDocument || {};

            obj = JSON.parse(obj);
            dom = JSON.parse(dom);

            if(!obj || !dom) return true;

            for (let src in data) {
                if (data[src] != dom[src]) {
                    return true;
                }
            }

            return false;
        }

        return true;
    };

    //Cache
    const tmpl = (str: string, data?: any): void => {

        if (compare(data)) {
            let dom = new VDom();

            let dataReplaced: any;

            for (let i in data) {
                let regExpression = new RegExp('{{' + i + '}}');
                str = str.replace(regExpression, data[i]);
            }

            dom.body().setHtml(str);
            sessionStorage.currentDocument = JSON.stringify({ doc: dom, obj: data });

            dom.apply();
        } else {
            sessionStorage.currentDocument.doc.apply();
        }
    };

    let current: any = null;
    const router = (): void => {
        // Lazy load view element:
        el = el || document.getElementById('view');
        // Clear existing observer:
        if (current) {
            current = null;
        }
        // Current route url (getting rid of '#' in hash as well):
        var url = location.hash.slice(1) || '/';
        // Get route by url:
        var route = routes[url];
        // Do we have both a view and a route?
        if (el && route.controller) {
            // Set current route information:
            current = {
                controller: new route.controller,
                template: route.templateId, //modificar acá para renderizar la vista
                render: (): void => {
                    // Render route template with John Resig's template engine:
                    el.innerHTML = tmpl(route.templateId, new route.controller());
                }
            };
            // Render directly:
            current.render();

            //Configure watchs
            arrayCallbacks.forEach(event => {
                el.addEventListener(event.domEvent, (mutationEvent: MutationObserver): void => {
                    event.callback[event.domEvent](el, mutationEvent);
                });
            });
        }
    };
    // Listen on hash change:
    this.addEventListener('hashchange', router);
    // Listen on page load:
    this.addEventListener('load', router);
    // Expose the route register function:
    this.route = route;
})();

//Ready
document.addEventListener('DOMContentLoaded', (): void => {

    //Set up this document
    let vdom = new VDom();

    vdom.setCallback('DOMNodeInserted', (event: MutationEvent): void => {
        console.log("Agregado", event);
    });

    vdom.body().setHtml(`<h1>TEST</h1>`);
});