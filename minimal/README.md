![capital-requirements and term calculang formulas](minimal.png)

Minimal code (removed comments and some redundant formulas) `capital-requirements.cul.js` and `term.cul.js` in `./src`.

`playground.cul.js` alongside them is to support the Actuarial Playground UI and it's particular formula outputs.

## Usage in the Actuarial Playground UI

~~~js
import { all_cul } from 'https://raw.githubusercontent.com/calculang/nested-life-projections-example/refs/heads/main/minimal/src/playground.cul.js'
~~~

**Important**: Then adjust sum assured to 100k via slider under `model point ⚙️`

*If you prefer usage in a node.js script or other, please create an issue to request it or a PR*
