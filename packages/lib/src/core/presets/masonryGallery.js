import LAYOUTS from '../../common/constants/layout';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import {
  calcTargetItemSize,
  processNumberOfImagesPerRow,
  processGridStyle,
} from '../helpers/layoutHelper';
import { featureManager } from '../helpers/versionsHelper';

const fixToMasonry = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.MASONRY;
  presetOptions.cubeImages = false;
  presetOptions.scrollDirection = SCROLL_DIRECTION.VERTICAL;
  presetOptions.groupSize = 1;
  presetOptions.groupTypes = '1';
  presetOptions.slideshowLoop = false;
  presetOptions.enableScroll = true;
  presetOptions.cropOnlyFill = false;
  return presetOptions;
};
export const fixedOptions = fixToMasonry({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToMasonry(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    res.isVertical ? res.gallerySize * 8 + 200 : res.gallerySize * 5 + 200
  );
  if (featureManager.supports.fixedColumnsInMasonry) {
    res = processNumberOfImagesPerRow(res);
  }
  res = processGridStyle(res);
  return res;
};
