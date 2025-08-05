Showing some output from the calculang compiler.

- `make-bundle.js` is the node.js script that creates outputs:
- `bundle.js` is the final Javascript output of the model, which can be used in a browser or other Javascript runtimes (including node.js)
- other .js files are the Javascript corresponding to each processed module. It may be informative to compare these to their corresponding `.cul.js` files, which highlights how the compiler manipulates calculang code into functioning Javascript.

Not shown: sourcemaps or introspection object.
