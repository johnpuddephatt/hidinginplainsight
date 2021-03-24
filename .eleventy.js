const slugify = require("slugify");

module.exports = function(eleventyConfig) {

  eleventyConfig.addLayoutAlias('default', 'layouts/default.njk');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
  eleventyConfig.addLayoutAlias('vue', 'layouts/vue.njk');

  // Copy files
  eleventyConfig.addPassthroughCopy({'./src/_data/site.json' : 'api/site.json'});

  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy('./src/assets');
  eleventyConfig.addPassthroughCopy('./src/uploads');

  // Markdown
  var md = require('markdown-it')({
    html: false,
    linkify: true,
    typographer: true
  });

  // Universal slug filter strips unsafe chars from URLs
  eleventyConfig.addFilter("slugify", function(str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@]/g
    });
  });

  eleventyConfig.addNunjucksFilter("markdownify", markdownString => md.render(markdownString));

  eleventyConfig.addNunjucksFilter('jsonify', function(str) {
    str = str.replace(/\r|\n|\r\n/g, '<br>');
    str = str.replace(/"/g, '\\"');
    return str;
  })


  eleventyConfig.addCollection('tours', collection => {
    return collection.getFilteredByGlob('./src/tours/*.md');
  });

  // Collections

  eleventyConfig.addCollection('pages', collection => {
    return collection.getFilteredByGlob('./src/pages/*.md').sort(function(a, b) {
      return b.data.order - a.data.order;
    });
  });

  eleventyConfig.addCollection('cinemas', collection => {
    return collection.getFilteredByGlob('./src/cinemas/*.md').sort(function(a, b) {
      let aTitle = a.data.title.replace("The ", "");
      let bTitle = b.data.title.replace("The ", "");
      if (aTitle < bTitle) return -1;
      else if (aTitle > bTitle) return 1;
      else return 0;
    });
  });

  eleventyConfig.addFilter('whereSlug', function (array, value) {
    return array.filter(item => {
      let slug = slugify(item.data.title, {
        lower: true,
        replacement: "-",
        remove: /[*+~.·,()'"`´%!?¿:@]/g
      });
      return (slug == value);
    });
  });

  eleventyConfig.setBrowserSyncConfig({
     files: [
       'assets/css',
       'assets/js'
     ]
   });

  return {
    dir: {
      input: "./src",
      output: "./dist",
      data: `./_data/`,
      includes: `./_includes/`,
    }
  };
};
