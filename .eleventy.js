module.exports = function(eleventyConfig) {

  // Copy files
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy('./src/assets');

  // Collections
  eleventyConfig.addCollection('cinemas', collection => {
    return collection.getFilteredByGlob('./src/cinemas/*.md');
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
