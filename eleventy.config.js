export default async function (eleventyConfig) {
	// Reset to this value
	// eleventyConfig.setTemplateFormats("njk, liquid, html");

	eleventyConfig.addPassthroughCopy("_worker.js");
	eleventyConfig.addPassthroughCopy("bundle.css");
	eleventyConfig.addPassthroughCopy("assets/fonts");
	eleventyConfig.addPassthroughCopy("assets/images");
};
