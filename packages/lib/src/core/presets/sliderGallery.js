import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import SLIDE_ANIMATIONS from '../../common/constants/slideAnimations';
import {
  calcTargetItemSize,
  removeBordersIfNeeded,
} from '../helpers/layoutHelper';

const fixToSlider = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.SLIDER;
  presetOptions.enableInfiniteScroll = true;
  presetOptions.cubeImages = true;
  presetOptions.scrollDirection = SCROLL_DIRECTION.HORIZONTAL;
  presetOptions.isVertical = false;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';
  presetOptions.numberOfImagesPerCol = 1;
  presetOptions.smartCrop = false;
  presetOptions.galleryType = 'Strips';
  presetOptions.hasThumbnails = false;
  presetOptions.enableScroll = true;
  presetOptions.scrollSnap = true;
  presetOptions.cropOnlyFill = true;
  presetOptions.slideAnimation = SLIDE_ANIMATIONS.SCROLL;
  return presetOptions;
};
export const fixedOptions = fixToSlider({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToSlider(res);
  res.targetItemSize = calcTargetItemSize(res);
  res = removeBordersIfNeeded(res);
  return res;
};
