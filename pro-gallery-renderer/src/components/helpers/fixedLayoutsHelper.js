
export function getFixedLayouts(layoutNumber) {
  const LayoutsNameList = [
    'bricks',
    'alternate',
    'mix'
  ];
  const layouts = {
    bricks: {
      sampleSize: 100,
      isVertical: true,
      gallerySize: 400,
      minItemSize: 50,
      groupSize: 3,
      chooseBestGroup: true,
      groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
      rotatingGroupTypes: '2h',
      cubeImages: true,
      cubeType: 'fill',
      smartCrop: false,
      collageDensity: 0.8,
      galleryMargin: 0,
      floatingImages: 0,
      cubeRatio: 1,
      fixedColumns: 1,
      groupsPerStrip: 0,
      oneRow: false,
      placeGroupsLtr: false,
      at: 1538487882356,
      rotatingCropRatios: '0.707,1.414,1.414,0.707',
    },
    alternate: {
      sampleSize: 100,
      isVertical: true,
      gallerySize: 86,
      minItemSize: 50,
      groupSize: 3,
      chooseBestGroup: true,
      groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
      rotatingGroupTypes: '1,3l,1,3r',
      cubeImages: true,
      cubeType: 'fill',
      smartCrop: false,
      collageDensity: 0.48,
      galleryMargin: 0,
      floatingImages: 0,
      cubeRatio: 1,
      fixedColumns: 1,
      groupsPerStrip: 0,
      oneRow: false,
      placeGroupsLtr: false,
      at: 1538490828979,
      rotatingCropRatios: '',
    },
    mix: {
      sampleSize: 100,
      isVertical: true,
      gallerySize: 86,
      minItemSize: 50,
      groupSize: 3,
      chooseBestGroup: true,
      groupTypes: '1,2h,2v,3t,3b,3l,3r,3v,3h',
      rotatingGroupTypes: '1,2h,1,2h',
      cubeImages: true,
      cubeType: 'fill',
      smartCrop: false,
      collageDensity: 0.48,
      galleryMargin: 0,
      floatingImages: 0,
      cubeRatio: 1,
      fixedColumns: 1,
      groupsPerStrip: 0,
      oneRow: false,
      placeGroupsLtr: false,
      at: 1538490323024,
      rotatingCropRatios: '',
    }
  };
  const layoutName = LayoutsNameList[layoutNumber];
  return layouts[layoutName];
}
