import LAYOUTS from '../../common/constants/layout';
import PLACEMENTS from '../../common/constants/placements';
import { calcTargetItemSize } from '../helpers/layoutHelper';
import GRID_STYLE from '../../common/constants/gridStyle';
import SLIDE_ANIMATIONS from '../../common/constants/slideAnimations';

const fixToCollage = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.COLLAGE;
  presetOptions.cubeImages = false;
  presetOptions.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  presetOptions.groupSize = 3;
  presetOptions.hasThumbnails = false;
  presetOptions.groupTypes = '1,2h,2v,3t,3b,3l,3r';
  presetOptions.slideshowLoop = false;
  presetOptions.numberOfImagesPerCol = 1;
  presetOptions.gridStyle = GRID_STYLE.FIT_TO_SCREEN;
  presetOptions.targetItemSize = 0;
  presetOptions.fixedColumns = 0;
  presetOptions.enableScroll = true;
  presetOptions.cropOnlyFill = false;
  presetOptions.slideAnimation = SLIDE_ANIMATIONS.SCROLL;
  return presetOptions;
};
export const fixedOptions = fixToCollage({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToCollage(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res.gallerySize * 5 + 500)
  );
  return res;
};
