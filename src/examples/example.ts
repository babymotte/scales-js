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

import { linearScale, logarithmicScale } from "../index.js";

const linMin = 0;
const linMax = 100;
const logMin = -1000;
const logMax = -1;

const linear = linearScale(linMin, linMax);
const logarithmic = logarithmicScale(logMin, logMax);
const toLog = (val: number) => linear.convertTo(logarithmic, val);
const fromLog = (val: number) => logarithmic.convertTo(linear, val);

console.log("0 lin =>", toLog(0), "log");
console.log("25 lin =>", toLog(25), "log");
console.log("50 lin =>", toLog(50), "log");
console.log("75 lin =>", toLog(75), "log");
console.log("100 lin =>", toLog(100), "log");

console.log("-1000 log =>", fromLog(-1000), "lin");
console.log("-100 log =>", fromLog(-100), "lin");
console.log("-10 log =>", fromLog(-10), "lin");
console.log("-1 log =>", fromLog(-1), "lin");
