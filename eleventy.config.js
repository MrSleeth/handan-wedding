import { IdAttributePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default async function (eleventyConfig) {
	// Reset to this value
	// eleventyConfig.setTemplateFormats("njk, liquid, html");

	eleventyConfig.addPassthroughCopy("_worker.js");
	eleventyConfig.addPassthroughCopy("bundle.css");
	eleventyConfig.addPassthroughCopy("assets/fonts");
	eleventyConfig.addPassthroughCopy("assets/images");
	eleventyConfig.addPassthroughCopy("assets/*.pdf");
	eleventyConfig.addPassthroughCopy("assets/favicons/*");
	eleventyConfig.addPlugin(IdAttributePlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);
};
