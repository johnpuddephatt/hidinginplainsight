module.exports = function(eleventyConfig) {

  // Copy files
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy('./src/assets');
  eleventyConfig.addPassthroughCopy('./src/uploads');

  // Markdown
  var md = require('markdown-it')({
    html: false,
    linkify: true,
    typographer: true
  });

  eleventyConfig.addNunjucksFilter("markdownify", markdownString => md.render(markdownString));

  eleventyConfig.addNunjucksFilter('jsonify', function(str) {
    str = str.replace(/\r|\n|\r\n/g, '');
    str = str.replace(/"/g, '\\"');
    return str;
  })

  // Collections
  eleventyConfig.addCollection('cinemas', collection => {
    return collection.getFilteredByGlob('./src/cinemas/*.md').sort(function(a, b) {
      let aTitle = a.data.title.replace("The ", "");
      let bTitle = b.data.title.replace("The ", "");
      if (aTitle < bTitle) return -1;
      else if (aTitle > bTitle) return 1;
      else return 0;
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
