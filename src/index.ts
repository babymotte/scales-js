/**
 * Copyright 2024 Michael Bachmann
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export type ToRatio = (absolute: number) => number;
export type ToAbsolute = (ratio: number) => number;

export type Scale = {
  min: number;
  max: number;
  toRatio: ToRatio;
  toAbsolute: ToAbsolute;
  applyDeltaTo: (
    otherScale: Scale,
    delta: number,
    otherCurrent: number
  ) => number;
  convertTo: (otherScale: Scale, value: number) => number;
};

export function clamped(scale: Scale) {
  const { min, max, toRatio, toAbsolute } = scale;

  return {
    ...scale,
    toRatio: (v: number) => clampedToRatio(v, toRatio),
    toAbsolute: (r: number) => clampedToAbsolute(r, min, max, toAbsolute),
  };
}

function clampedToRatio(value: number, toRatio: ToRatio) {
  return Math.max(0.0, Math.min(toRatio(value), 1.0));
}

function clampedToAbsolute(
  ratio: number,
  min: number,
  max: number,
  toAbsolute: ToAbsolute
) {
  return Math.max(min, Math.min(toAbsolute(ratio), max));
}

function convertScaleTo(otherScale: Scale, a: number, toRatio: ToRatio) {
  const ratio = toRatio(a);
  return otherScale.toAbsolute(ratio);
}

function applyDeltaToScale(
  otherScale: Scale,
  delta: number,
  otherCurrent: number,
  toAbsolute: ToAbsolute,
  toRatio: ToRatio
) {
  const currentRatio = otherScale.toRatio(otherCurrent);
  const currentAbs = toAbsolute(currentRatio);
  const newAbs = currentAbs + delta;
  const newRatio = toRatio(newAbs);
  return otherScale.toAbsolute(newRatio);
}

export function linearScale(
  min: number,
  max: number,
  inverted?: boolean
): Scale {
  const range = max - min;

  const toRatio = (a: number) => {
    const r = (a - min) / range;
    if (inverted) {
      return 1.0 - r;
    } else {
      return r;
    }
  };

  const toAbsolute = (r: number) => {
    if (inverted) {
      return min + (1.0 - r) * range;
    } else {
      return min + r * range;
    }
  };

  const convertTo = (otherScale: Scale, a: number) => {
    return convertScaleTo(otherScale, a, toRatio);
  };

  const applyDeltaTo = (
    otherScale: Scale,
    delta: number,
    otherCurrent: number
  ) => {
    return applyDeltaToScale(
      otherScale,
      delta,
      otherCurrent,
      toAbsolute,
      toRatio
    );
  };

  return {
    min,
    max,
    toRatio,
    toAbsolute,
    convertTo,
    applyDeltaTo,
  };
}

export function rasteredLinearScale(
  min: number,
  max: number,
  stepSize: number,
  inverted?: boolean
): Scale {
  const delegate = linearScale(min, max, inverted);

  const toRatio = (a: number) => {
    const rastered = Math.round(a / stepSize) * stepSize;
    return delegate.toRatio(rastered);
  };

  const toAbsolute = (r: number) => {
    const a = delegate.toAbsolute(r);
    return Math.round(a / stepSize) * stepSize;
  };

  const convertTo = (otherScale: Scale, a: number) => {
    return convertScaleTo(otherScale, a, toRatio);
  };

  const applyDeltaTo = (
    otherScale: Scale,
    delta: number,
    otherCurrent: number
  ) => {
    return applyDeltaToScale(
      otherScale,
      delta,
      otherCurrent,
      toAbsolute,
      toRatio
    );
  };

  return {
    min,
    max,
    toRatio,
    toAbsolute,
    convertTo,
    applyDeltaTo,
  };
}

export function logarithmicScale(
  min: number,
  max: number,
  inverted?: boolean
): Scale {
  const sign = Math.sign(min);

  const logMin = sign < 0 ? Math.log10(sign * max) : Math.log10(sign * min);
  const logMax = sign < 0 ? Math.log10(sign * min) : Math.log10(sign * max);
  const logRange = logMax - logMin;

  const toRatio = (a: number) => {
    const logAbs = Math.log10(sign * a);
    const r = (logAbs - logMin) / logRange;
    if (inverted) {
      return 1.0 - r;
    } else {
      return r;
    }
  };

  const toAbsolute = (r: number) => {
    if (inverted) {
      const logAbs = logMin + (1.0 - r) * logRange;
      return sign * Math.pow(10, logAbs);
    } else {
      const logAbs = logMin + r * logRange;
      return sign * Math.pow(10, logAbs);
    }
  };

  const convertTo = (otherScale: Scale, a: number) => {
    return convertScaleTo(otherScale, a, toRatio);
  };

  const applyDeltaTo = (
    otherScale: Scale,
    delta: number,
    otherCurrent: number
  ) => {
    return applyDeltaToScale(
      otherScale,
      delta,
      otherCurrent,
      toAbsolute,
      toRatio
    );
  };

  return {
    min,
    max,
    toRatio,
    toAbsolute,
    convertTo,
    applyDeltaTo,
  };
}

export function noopScale() {
  return {
    toRatio: (v: number) => v,
    toAbsolute: (v: number) => v,
    convertTo: (other: Scale, v: number) => v,
    applyDeltaTo: (other: Scale, d: number, c: number) => c + d,
  };
}

export function noopScaleConverter() {
  return {
    toInternal: (v: number) => v,
    toExternal: (v: number) => v,
  };
}
