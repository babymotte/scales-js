# scales

Convert between different scale types easily. This was developed specifically as a utility when building graphical user interfaces to make the conversion between UI scales and value scales easier, but it can be used pretty much everywhere.

Here's how you convert between a linear scale from 0 to 100 and a logarithmic scale from -1000 to -1:

```JavaScript
import { linearScale, logarithmicScale } from "@babymotte/scales";
const linear = linearScale(0, 100);
const logarithmic = logarithmicScale(-1000, -1);
const toLog = (val: number) => linear.convertTo(logarithmic, val);
const fromLog = (val: number) => logarithmic.convertTo(linear, val);
```