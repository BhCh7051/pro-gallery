import React from 'react';
import { defaultStyles, BlueprintsManager } from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import LeanGallery from './leanGallery/leanGallery';

const blueprintsManager = new BlueprintsManager({id: 'layoutingGallery'});
export default class BaseGallery extends React.Component {
  constructor(props) {
    super();
    this.state ={};
    blueprintsManager.init({api:{isUsingCustomInfoElements:()=>(props.customHoverRenderer || props.customInfoRenderer || props.customSlideshowInfoRenderer)}})
    this.onNewProps(props)
  }

  static propTypes = basePropTypes;
  onNewProps(props) {
    const domId = props.domId || 'default-dom-id';
    const { styles, options, styleParams, eventsListener, ...otherProps } = props;
    const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    const galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId}
    if (!isEligibleForLeanGallery(galleryProps)) {
        blueprintsManager.createBlueprint(galleryProps).then(blueprint => {
          this.setState({blueprint});
        }).catch((e)=>{console.error('Could not breate a blueprints in layoutingIndex ', e)});
    }
    }
    
  componentWillReceiveProps(newProps) {
    this.onNewProps(newProps);
  }

  render() {
    debugger;
    const domId = this.props.domId || 'default-dom-id';
    const { styles, options, styleParams, eventsListener, ...otherProps } = this.props;
    const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    const galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId};
    
    let GalleryComponent = ProGallery;
    let blueprint = {};
    if (isEligibleForLeanGallery(galleryProps)) {
      GalleryComponent = LeanGallery;
    } else {
      if (!this.state.blueprint || Object.keys(this.state.blueprint).length === 0){
        try {
          const {layoutFixer} = window;
          if (typeof window !== 'undefined' && layoutFixer && !layoutFixer.hydrated) {
            blueprint.structure = layoutFixer.structure;
            blueprint.container = layoutFixer.container;
            blueprint.items = layoutFixer.items;
            layoutFixer.hydrated = true;
            console.log('[LAYOUT FIXER] used structure and container from layoutFixer', layoutFixer);
          } else {
            return null;
          }
        } catch (e) {
          console.log('Failed to get data from the layoutFixer', e);
          return null;
        }
      } else {
        blueprint = this.state.blueprint;
      }
    }

    return <GalleryComponent {...galleryProps} { ...blueprint} />
  }
}

