#!/usr/bin/env bun

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { dirname } from "path";

/**
 * Ensures that the directory for a file exists before writing to it
 */
function ensureDirectoryExists(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.info(`Created directory: ${dir}`);
  }
}

/**
 * Creates a Payload block collection file
 */
function createBlockCollectionFile(name: string): void {
  const filePath = `./src/lib/payload/collections/Pages/blocks/${name}.ts`;

  const content = `import { Block } from "payload"
import { sectionField } from "@/lib/payload/fields"

export const ${name}: Block = {
  slug: "${name}",
  interfaceName: "${name}Block",
  fields: [
    sectionField,
  ],
}
`;

  ensureDirectoryExists(filePath);
  writeFileSync(filePath, content);
  console.info(`Created block collection file: ${filePath}`);
}

/**
 * Creates a React component file for the section
 */
function createComponentFile(name: string): void {
  const filePath = `./src/lib/components/site/blocks/sections/${name}.tsx`;

  const content = `import { ${name}Block } from "@/payload-types"
import { Section } from "@/lib/components/site/Section"

export const ${name}Section: React.FC<${name}Block> = (p) => {
  return (
    <Section section={p.section}>
    </Section>
  )
}
`;

  ensureDirectoryExists(filePath);
  writeFileSync(filePath, content);
  console.info(`Created component file: ${filePath}`);
}

/**
 * Updates the Pages/index.ts file to import and include the new block
 */
function updatePagesCollectionFile(name: string): void {
  const filePath = "./src/lib/payload/collections/Pages/index.ts";
  if (!existsSync(filePath)) {
    console.error(`Error: ${filePath} does not exist`);
    process.exit(1);
  }
  let content = readFileSync(filePath, "utf8");
  let lines = content.split("\n");
  // Find where to add the import statement
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("import ")) {
      lastImportIndex = i;
    }
    if (lines[i].includes("//import here")) {
      // If there's a comment marker, use that instead
      lastImportIndex = i;
      break;
    }
  }
  if (lastImportIndex === -1) {
    console.error(`Error: Cannot find import statements in ${filePath}`);
    process.exit(1);
  }
  // Create the new import statement
  const importStatement = `import { ${name} } from "./blocks/${name}"`;
  // Add import after the last import or the comment marker
  lines.splice(lastImportIndex + 1, 0, importStatement);

  // Find the Pages array - look for the line that contains "export const Pages"
  let arrayStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("export const Pages")) {
      arrayStartIndex = i;
      break;
    }
  }
  if (arrayStartIndex === -1) {
    console.error(`Error: Cannot find Pages export in ${filePath}`);
    process.exit(1);
  }

  // Find the closing bracket of the array
  let arrayEndIndex = -1;
  let bracketCount = 0;

  // Start from the array start line and track bracket balance
  for (let i = arrayStartIndex; i < lines.length; i++) {
    // Count brackets in this line
    const openBrackets = (lines[i].match(/\[/g) || []).length;
    const closeBrackets = (lines[i].match(/\]/g) || []).length;

    bracketCount += openBrackets - closeBrackets;

    if (bracketCount === 0 && openBrackets + closeBrackets > 0) {
      // We've found the matching closing bracket
      arrayEndIndex = i;
      break;
    }
  }

  if (arrayEndIndex === -1) {
    console.error(
      `Error: Cannot find closing bracket for Pages array in ${filePath}`,
    );
    process.exit(1);
  }

  // Insert the new block right before the closing bracket
  // If the line with the closing bracket has content before it, insert on a new line
  if (lines[arrayEndIndex].trim() !== "]);") {
    // Extract the part of the line before the closing bracket
    const beforeBracket = lines[arrayEndIndex].split("]")[0];
    // Update the line without the closing bracket
    lines[arrayEndIndex] = beforeBracket;
    // Add the new block and closing bracket on the next lines
    lines.splice(arrayEndIndex + 1, 0, `  ${name},`);
    lines.splice(arrayEndIndex + 2, 0, "]);");
  } else {
    // If the closing bracket is on its own line, insert before it
    lines.splice(arrayEndIndex, 0, `  ${name},`);
  }

  // Write the updated content back to the file
  content = lines.join("\n");
  writeFileSync(filePath, content);
  console.info(`Updated Pages collection file: ${filePath}`);
}

/**
 * Updates the PageSections.tsx file to include the new section
 */
export function updatePageSectionsFile(name: string): void {
  const filePath = "./src/lib/components/site/PageSections.tsx";

  if (!existsSync(filePath)) {
    console.error(`Error: ${filePath} does not exist`);
    process.exit(1);
  }

  let content = readFileSync(filePath, "utf8");
  let lines = content.split("\n");

  // STEP 1: Add the import statement
  // Create the new import statement
  const newImportStatement = `import { ${name}Section } from './blocks/sections/${name}'`;

  // Find all import statements
  let lastImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("import ")) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex !== -1) {
    // Insert new import after the last import statement
    lines.splice(lastImportIndex + 1, 0, newImportStatement);
  } else {
    console.error(`Error: Cannot find import statements in ${filePath}`);
    process.exit(1);
  }

  // STEP 2: Add case to switch statement
  let switchStartIndex = -1;
  let switchIndentation = "";

  // Find the switch statement
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("switch (s.blockType)")) {
      switchStartIndex = i;
      // Extract the indentation before the switch
      const indentMatch = lines[i].match(/^\s*/);
      switchIndentation = indentMatch ? indentMatch[0] : "";
      break;
    }
  }

  if (switchStartIndex === -1) {
    console.error(`Error: Cannot find switch statement in ${filePath}`);
    process.exit(1);
  }

  // Find the first case after the opening brace
  let openingBraceIndex = -1;
  for (let i = switchStartIndex; i < lines.length; i++) {
    if (lines[i].includes("{")) {
      openingBraceIndex = i;
      break;
    }
  }

  if (openingBraceIndex === -1) {
    console.error(
      `Error: Cannot find opening brace of switch statement in ${filePath}`,
    );
    process.exit(1);
  }

  // Create case statement with proper indentation
  const caseIndentation = switchIndentation + "  "; // Add two spaces for case indentation
  const caseStatement = [
    `${caseIndentation}case "${name}":`,
    `${caseIndentation}  return <${name}Section {...s} key={key} />`,
  ];

  // Insert case statement right after the opening brace of the switch
  lines.splice(openingBraceIndex + 1, 0, ...caseStatement);

  // Write the updated content back to the file
  content = lines.join("\n");
  writeFileSync(filePath, content);
  console.info(`Updated page sections file: ${filePath}`);
}

/**
 * Main function to scaffold a new section
 */
function main(name: string): void {
  if (!name) {
    console.error("Error: Please provide a section name");
    process.exit(1);
  }

  console.info(`Scaffolding section: ${name}`);

  createBlockCollectionFile(name);
  createComponentFile(name);
  updatePageSectionsFile(name);
  updatePagesCollectionFile(name);

  console.info(`\nSuccessfully scaffolded ${name} section!`);
}

// Get section name from command line arguments
const sectionName = process.argv[2];
main(sectionName);
