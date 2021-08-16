import packageInfo from "./package-info";

export const name = packageInfo.name.split("/").pop();

export const { author, license, keywords, version, description, jspatcher } = packageInfo;

export default { name, author, license, keywords, version, description, ...jspatcher };