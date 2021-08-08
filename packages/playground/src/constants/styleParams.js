import {
  addPresetStyles,
  getLayoutName,
  NEW_PRESETS,
  defaultStyles,
  galleryOptions,
} from 'pro-gallery-lib';

const defaultStyleParams = defaultStyles;
Object.entries(galleryOptions).forEach(
  ([styleParam, settings]) =>
    (defaultStyleParams[styleParam] = settings.default)
);

export const getInitialStyleParams = () => {
  const savedStyleParams = getStyleParamsFromUrl(window.location.search);
  return {
    ...defaultStyleParams,
    ...savedStyleParams,
  };
};

const formatValue = (val) => {
  if (String(val) === 'true') {
    return true;
  } else if (String(val) === 'false') {
    return false;
  } else if (Number(val) === parseInt(val)) {
    return Number(val);
  } else {
    return String(val);
  }
};

export const isValidStyleParam = (styleParam, value, styleParams) => {
  if (!styleParam) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} is undefined`);
    return false;
  }
  if (typeof value === 'undefined') {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is undefined`);
    return false;
  }
  if (value === defaultStyles[styleParam]) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is as the default: ${value}`);
    return false;
  }
  styleParams = { ...defaultStyles, ...styleParams };
  const preset = NEW_PRESETS[getLayoutName(styleParams.galleryLayout)];
  if (styleParam !== 'galleryLayout' && value === preset[styleParam]) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is as the preset: ${value}`, preset, getLayoutName(styleParams.galleryLayout));
    return false;
  }
  if (!galleryOptions[styleParam]) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} has not galleryOptions`);
    return false;
  }
  if (!galleryOptions[styleParam].isRelevant(styleParams)) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is not relevant`, galleryOptions[styleParam].isRelevant.toString(), styleParams);
    return false;
  }
  return true;
};

export const getStyleParamsFromUrl = (locationSearchString) => {
  try {
    let styleParams = locationSearchString
    .replace('?', '')
    .split('&')
    .map((styleParam) => styleParam.split('='))
    .reduce(
      (obj, [styleParam, value]) =>
      Object.assign(obj, { [styleParam]: formatValue(value) }),
      {}
      );

      styleParams = addPresetStyles({ ...defaultStyleParams, ...styleParams });

    const relevantStyleParams = Object.entries(styleParams).reduce(
      (obj, [styleParam, value]) =>
        isValidStyleParam(styleParam, value, styleParams)
          ? Object.assign(obj, { [styleParam]: formatValue(value) })
          : obj,
      {}
    );

    // console.log(`[STYLE PARAMS - VALIDATION] getting styleParams from the url`, relevantStyleParams);
    return Object.entries(relevantStyleParams).reduce(
      (obj, [styleParam, value]) =>
      assignByString(obj,styleParam, value),{}
    );
  } catch (e) {
    console.error('Cannot getStyleParamsFromUrl', e);
    return {};
  }
};
function assignByString(
  Obj,
  string,
  value,
) {
  let _obj = { ...Obj };
  let keyArr = string.split('_');
  let assignedProperty = keyArr.pop();
  let pointer = _obj;
  keyArr.forEach((key) => {
    if (!pointer[key]) pointer[key] = {};
    pointer = pointer[key];
  });
  pointer[assignedProperty] = value;
  return _obj;
}

function flattenObject(ob) {
  var toReturn = {};

  for (var i in ob) {
    // eslint-disable-next-line no-prototype-builtins
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

export const setStyleParamsInUrl = (styleParams) => {
  const flatSP = flattenObject(styleParams);
  // console.log(`[STYLE PARAMS - VALIDATION] setting styleParams in the url`, styleParams);
  const urlParams = Object.entries(flatSP)
    .reduce(
      (arr, [styleParam, value]) =>
        isValidStyleParam(styleParam, value, flatSP)
          ? arr.concat(`${styleParam}=${value}`)
          : arr,
      []
    )
    .join('&');
  //window.location.search = '?' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => arr.concat(`${styleParam}=${value}`), []).join('&')
  // window.location.hash = '#' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => styleParam && arr.concat(`${styleParam}=${value}`), []).join('&')
  window.history.replaceState({}, 'Pro Gallery Playground', '?' + urlParams);
};
