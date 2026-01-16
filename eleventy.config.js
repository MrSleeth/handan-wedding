export default function (eleventyConfig) {
	// Reset to this value
	eleventyConfig.setTemplateFormats("njk, html");
  eleventyConfig.markdownTemplateEngine("njk");

	eleventyConfig.addPassthroughCopy("_worker.js");
};