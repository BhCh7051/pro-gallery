
// import { createLayout } from 'pro-layouts';
import { createLayout } from 'pro-layouts';

export const createLayoutFixer = (mediaUrlFixer) => {
    const convertDtoToLayoutItem = (dto) => {
        const isLayoutItem = !!(dto.id && dto.width > 0 && dto.height > 0);
        if (isLayoutItem) {
            return dto;
        } else {
            const metadata = dto.metadata || dto.metaData;
            return {
                id: dto.itemId || dto.photoId,
                width: metadata.width,
                height: metadata.height,
                ...dto,
            };
        }
    }

    // const setAttributes = (node, attributes) =>
    //     node &&
    //     attributes &&
    //     Object.keys(attributes).forEach((attr) =>
    //         node.setAttribute(attr, attributes[attr]),
    //     );
    const createCssStr = (element, styleProperties) => {
        let cssStr = `#${element.getAttribute('id')} {`;
        Object.entries(styleProperties).forEach(([key, val]) => {
            cssStr += `${key}: ${val} !important;`;
        });
        cssStr += `}`;
        console.log('[LAYOUT FIXER] created css', cssStr);
        return cssStr;
    }

    const setCss = (parent, css, domId) => {
        const styleTag = document.getElementById('layout-fixer-style-' + domId);
        parent.appendChild(styleTag);
        styleTag.appendChild(document.createTextNode(css));
    }
    
    const removeStyleTag = (parent, domId, removeCssOnMount, removeCssWithDelay) => {
        if (removeCssOnMount) {
            const styleTag = document.getElementById('layout-fixer-css-' + domId);
            parent.removeChild(styleTag);
        } else if (removeCssWithDelay) {
            setTimeout(() => {
                const styleTag = document.getElementById('layout-fixer-css-' + domId);
                parent.removeChild(styleTag);
            }, 5000)
        }
    }

    const setStyle = (node, styleProperties) => {
        node &&
        styleProperties &&
        Object.keys(styleProperties).forEach((prop) => {
            const propValue = styleProperties[prop];
            if (propValue !== undefined) {
                node.style[prop] = propValue;
            } else {
                node.style.removeProperty(prop);
            }
        });
    }

    const getItemWrapperStyle = (item, styleParams) => ({
        width: item.width + 'px',
        height: item.height + (styleParams.externalInfoHeight || 0) + 'px',
        margin: 0
    })

    const getItemContainerStyle = (item, styleParams) => {
        const itemWrapperStyles = getItemWrapperStyle(item, styleParams)
        const { isRTL } = styleParams
        return {
            opacity: 1,
            top: item.offset.top + 'px',
            left: isRTL ? 'auto' : item.offset.left + 'px',
            right: !isRTL ? 'auto' : item.offset.left + 'px',
            ...itemWrapperStyles
        }
    }

    const getQueryParams = () => {
        const isTrueInQuery = key => location.search.toLowerCase().indexOf(key.toLowerCase() + '=true') >= 0;
        const keys = ['disableInlineStyles', 'disableSavedBlueprint', 'useCssTag', 'dontSetHighResImage', 'enableAfterMount', 'disableAfterHydrate', 'noRetries', 'removeCssOnMount', 'removeCssWithDelay'];
        const queryParams = {};
        keys.forEach(key => queryParams[key] = isTrueInQuery(key));
        return queryParams;
    }

    const createWebComponent = () => {
        console.log('[LAYOUT FIXER] createWebComponent');
        class LayoutFixerElement extends HTMLElement {
            constructor() {
                super();
                this.retries = 3;
                this.connectedCallback = this.connectedCallback.bind(this);
                if (!window.layoutFixer) {
                    window.layoutFixer = {};
                }
            }

            retry() {
                if (this.retries > 0) {
                    this.retries--;
                    console.log('[LAYOUT FIXER] retrying...', this.retries);
                    window.requestAnimationFrame(this.connectedCallback);
                } else {
                    console.log('[LAYOUT FIXER] reached retries limit');
                }
            }

            connectedCallback() {
                const canUse = getQueryParams();
                this.domId = this.getAttribute('domId');
                if (!window.layoutFixer[this.domId]) {
                    window.layoutFixer[this.domId] = {
                        disableSavedBlueprint: canUse.disableSavedBlueprint
                    }
                } else if (window.layoutFixer[this.domId].done) {
                    return;
                } else if (window.layoutFixer[this.domId].mounted && !canUse.enableAfterMount) {
                    return;
                } else if (window.layoutFixer[this.domId].hydrated && canUse.disableAfterHydrate) {
                    return;
                } 
                console.log('[LAYOUT FIXER] connectedCallback');
                this.parentId = 'pro-gallery-' + this.domId;
                this.parent = document.getElementById(this.parentId);
                if (!this.parent) {
                    console.log('[LAYOUT FIXER] no parent found', this.parent);
                    canUse.noRetries || this.retry();
                    return;
                } else {
                    console.log('[LAYOUT FIXER] parent found', this.parent);
                }

                this.useLayouter = true
                this.items = JSON.parse(this.getAttribute('items')).map(convertDtoToLayoutItem);
                if (!(this.items && this.items.length > 0)) {
                    this.useLayouter = false
                } else {
                    window.layoutFixer[this.domId].items = this.items;
                }

                this.styleParams = JSON.parse(this.getAttribute('styles'));

                if (!(this.styleParams && typeof this.styleParams === 'object')) {
                    this.useLayouter = false
                } else {
                    window.layoutFixer[this.domId].styles = this.styleParams;
                }

                const { width, height, top } = this.parent && this.parent.getBoundingClientRect();
                this.measures = {
                    top,
                    width,
                    height,
                    scrollBase: top,
                };
                window.layoutFixer[this.domId].container = this.measures;
                console.log('[LAYOUT FIXER] measured container', this.measures);

                if (this.measures && this.useLayouter && typeof createLayout === 'function') {
                    this.layout = createLayout({
                        items: this.items,
                        styleParams: this.styleParams,
                        container: this.measures
                    })
                    console.log('[LAYOUT FIXER] created layout', this.layout);
                    window.layoutFixer[this.domId].structure = this.layout;
                }

                if (this.useLayouter && this.layout && this.layout.items && this.layout.items.length > 0) {
                    const itemContainers = this.parent.querySelectorAll('.gallery-item-container');
                    const itemWrappers = this.parent.querySelectorAll('.gallery-item-wrapper');
                    const itemHighResImage = this.parent.querySelectorAll('[data-hook=gallery-item-image-img]');


                    if (itemWrappers.length > 0 && itemContainers.length > 0) {
                        if (!canUse.dontSetHighResImage && typeof mediaUrlFixer === 'function') {
                            itemHighResImage.forEach((element, idx) => {
                                const mediaUrl = element.getAttribute('data-src');
                                if (mediaUrl && typeof mediaUrl === 'string') {
                                    const src = mediaUrlFixer(mediaUrl, this.layout.items[idx].width, this.layout.items[idx].height);
                                    if (src) {
                                        !idx && console.log('[LAYOUT FIXER] set first Image src Style', idx, src);
                                        element.setAttribute('src', src);
                                        setStyle(element, {opacity: 1});
                                    }
                                }
                            })
                        }
                        
                        if (canUse.useCssTag) {
                            let cssStr = '';
                            itemContainers.forEach((element, idx) => {
                                !idx && console.log('[LAYOUT FIXER] set first Container CSS', idx, getItemContainerStyle(this.layout.items[idx], this.styleParams));
                                cssStr += createCssStr(element, getItemContainerStyle(this.layout.items[idx], this.styleParams));
                            })
                            
                            itemWrappers.forEach((element, idx) => {
                                !idx && console.log('[LAYOUT FIXER] set first Wrapper CSS', idx, getItemWrapperStyle(this.layout.items[idx], this.styleParams));
                                cssStr += createCssStr(element, getItemWrapperStyle(this.layout.items[idx], this.styleParams));
                            })
                            setCss(this.parent, cssStr, this.domId);
                        } 
                        
                        if (!canUse.avoidInlineStyles) {
                            itemContainers.forEach((element, idx) => {
                                !idx && console.log('[LAYOUT FIXER] set first Container Style', idx, getItemContainerStyle(this.layout.items[idx], this.styleParams));
                                setStyle(element, getItemContainerStyle(this.layout.items[idx], this.styleParams))
                            })
                            
                            itemWrappers.forEach((element, idx) => {
                                !idx && console.log('[LAYOUT FIXER] set first Wrapper Style', idx, getItemWrapperStyle(this.layout.items[idx], this.styleParams));
                                setStyle(element, getItemWrapperStyle(this.layout.items[idx], this.styleParams))
                            })
                        }
                        
    
                        window.layoutFixer[this.domId].done = Date.now();
                        window.layoutFixer[this.domId].onMount = () => {
                            console.log('[LAYOUT FIXER] onMount');
                            removeStyleTag(this.parent, this.domId, canUse('removeCssOnMount'), canUse('removeCssWithDelay'));
                        }
                        console.log('[LAYOUT FIXER] Done');
                    } else {
                        console.log('[LAYOUT FIXER] Cannot find elements', itemContainers, itemWrappers, this.parent);
                        canUse.noRetries || this.retry();
                    }
                }
            }
        }
        window.customElements.define('layout-fixer', LayoutFixerElement);
    }

    if (typeof window !== 'undefined') {
        try {
            console.log('[LAYOUT FIXER] Start (script is running)');
            createWebComponent()
        } catch (e) {
            console.error('Cannot create layout fixer', e);
        }
    }
}