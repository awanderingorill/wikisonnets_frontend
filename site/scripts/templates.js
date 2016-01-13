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
                for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                    var line = $$obj[index];
                    if (line.page_id == 0) {
                        buf.push('<p class="index-poem__line"><span class="index-poem__line-content">' + jade.escape(null == (jade_interp = "----------------") ? "" : jade_interp) + "</span></p>");
                    } else {
                        if (index === 5 || index === 10) {
                            buf.push("<p" + jade.cls([ "index-poem__line--" + index + "" ], [ true ]) + '><span class="index-poem__line-content">' + jade.escape(null == (jade_interp = line.text) ? "" : jade_interp) + "</span></p>");
                        } else {
                            buf.push('<p class="index-poem__line"><span class="index-poem__line-content">' + jade.escape(null == (jade_interp = line.text) ? "" : jade_interp) + "</span></p>");
                        }
                    }
                    if (index !== 0 && (index + 1) % 4 === 0) {
                        buf.push("<br>");
                    }
                }
            } else {
                var $$l = 0;
                for (var index in $$obj) {
                    $$l++;
                    var line = $$obj[index];
                    if (line.page_id == 0) {
                        buf.push('<p class="index-poem__line"><span class="index-poem__line-content">' + jade.escape(null == (jade_interp = "----------------") ? "" : jade_interp) + "</span></p>");
                    } else {
                        if (index === 5 || index === 10) {
                            buf.push("<p" + jade.cls([ "index-poem__line--" + index + "" ], [ true ]) + '><span class="index-poem__line-content">' + jade.escape(null == (jade_interp = line.text) ? "" : jade_interp) + "</span></p>");
                        } else {
                            buf.push('<p class="index-poem__line"><span class="index-poem__line-content">' + jade.escape(null == (jade_interp = line.text) ? "" : jade_interp) + "</span></p>");
                        }
                    }
                    if (index !== 0 && (index + 1) % 4 === 0) {
                        buf.push("<br>");
                    }
                }
            }
        }).call(this);
    }).call(this, "poem" in locals_for_with ? locals_for_with.poem : typeof poem !== "undefined" ? poem : undefined, "undefined" in locals_for_with ? locals_for_with.undefined : typeof undefined !== "undefined" ? undefined : undefined);
    return buf.join("");
};

// tooltips.jade compiled template
templatizer["tooltips"] = function tmpl_tooltips(locals) {
    var buf = [];
    var jade_mixins = {};
    var jade_interp;
    var locals_for_with = locals || {};
    (function(poem, undefined) {
        (function() {
            var $$obj = poem;
            if ("number" == typeof $$obj.length) {
                for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
                    var line = $$obj[index];
                    var startIndex = line.tooltip.snippet.indexOf(line.text);
                    var endIndex = startIndex + line.text.length;
                    buf.push('<p class="index-poem__tooltip">' + jade.escape(null == (jade_interp = "'..." + line.tooltip.snippet.slice(0, startIndex)) ? "" : jade_interp) + '<span class="index-poem__tooltip-line">' + jade.escape(null == (jade_interp = line.tooltip.snippet.slice(startIndex, endIndex)) ? "" : jade_interp) + "</span>" + jade.escape(null == (jade_interp = line.tooltip.snippet.slice(endIndex)) ? "" : jade_interp) + '...\' <span class="index-poem__tooltip-citation">—"<a' + jade.attr("href", "" + line.tooltip.url + "", true, true) + ' target="_blank">' + jade.escape(null == (jade_interp = line.tooltip.title) ? "" : jade_interp) + '</a>"</span></p>');
                }
            } else {
                var $$l = 0;
                for (var index in $$obj) {
                    $$l++;
                    var line = $$obj[index];
                    var startIndex = line.tooltip.snippet.indexOf(line.text);
                    var endIndex = startIndex + line.text.length;
                    buf.push('<p class="index-poem__tooltip">' + jade.escape(null == (jade_interp = "'..." + line.tooltip.snippet.slice(0, startIndex)) ? "" : jade_interp) + '<span class="index-poem__tooltip-line">' + jade.escape(null == (jade_interp = line.tooltip.snippet.slice(startIndex, endIndex)) ? "" : jade_interp) + "</span>" + jade.escape(null == (jade_interp = line.tooltip.snippet.slice(endIndex)) ? "" : jade_interp) + '...\' <span class="index-poem__tooltip-citation">—"<a' + jade.attr("href", "" + line.tooltip.url + "", true, true) + ' target="_blank">' + jade.escape(null == (jade_interp = line.tooltip.title) ? "" : jade_interp) + '</a>"</span></p>');
                }
            }
        }).call(this);
    }).call(this, "poem" in locals_for_with ? locals_for_with.poem : typeof poem !== "undefined" ? poem : undefined, "undefined" in locals_for_with ? locals_for_with.undefined : typeof undefined !== "undefined" ? undefined : undefined);
    return buf.join("");
};


module.exports = templatizer;
