export default async function (eleventyConfig) {
	// Reset to this value
	eleventyConfig.setTemplateFormats("njk, html");
  // eleventyConfig.markdownTemplateEngine("njk");

	eleventyConfig.addPassthroughCopy("_worker.js");
	eleventyConfig.addPassthroughCopy("bundle.css");
	eleventyConfig.addPassthroughCopy("/assets/fonts/*.woff2");
	eleventyConfig.addPassthroughCopy("/assets/fonts/*.woff");
	eleventyConfig.addPassthroughCopy("/assets/images");
};