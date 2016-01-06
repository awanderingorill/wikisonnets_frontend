var jade = require('@lukekarrys/jade-runtime');

var templatizer = {};



// poem.jade compiled template
templatizer["poem"] = function tmpl_poem(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(poem, undefined) {
        (function() {
            var $$obj = poem;
            if ("number" == typeof $$obj.length) {
                for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                    var line = $$obj[$index];
                    if (line.page_id == 0) {
                        buf.push("<p>" + jade.escape(null == (jade_interp = "----------------") ? "" : jade_interp) + "</p>");
                    } else {
                        buf.push("<p>" + jade.escape(null == (jade_interp = line.text) ? "" : jade_interp) + "</p>");
                    }
                }
            } else {
                var $$l = 0;
                for (var $index in $$obj) {
                    $$l++;
                    var line = $$obj[$index];
                    if (line.page_id == 0) {
                        buf.push("<p>" + jade.escape(null == (jade_interp = "----------------") ? "" : jade_interp) + "</p>");
                    } else {
                        buf.push("<p>" + jade.escape(null == (jade_interp = line.text) ? "" : jade_interp) + "</p>");
                    }
                }
            }
        }).call(this);
    }).call(this, "poem" in locals_for_with ? locals_for_with.poem : typeof poem !== "undefined" ? poem : undefined, "undefined" in locals_for_with ? locals_for_with.undefined : typeof undefined !== "undefined" ? undefined : undefined);
    return buf.join("");
};


module.exports = templatizer;
