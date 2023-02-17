#!/usr/bin/env node

import fs from "fs";
import { readFile } from "fs/promises";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";
import ncp from "ncp";
import { promisify } from "util";
import chalk from "chalk";
import figlet from "figlet";

const copy = promisify(ncp);
const json = JSON.parse(
	await readFile(new URL("./package.json", import.meta.url))
);

let selectedDir;
let selectedFile;
let dirs = [];
let files = [];

async function readDirectories() {
	const filesDirectory = path.resolve(
		fileURLToPath(import.meta.url),
		"../files"
	);
	// Read directories
	dirs = fs.readdirSync(filesDirectory);
	// Capitalize first letter of each directory
	dirs = dirs.map((dir) => {
		return dir.charAt(0).toUpperCase() + dir.slice(1);
	});
}

async function readFilesOfDir() {
	const filesDirectory = path.resolve(
		fileURLToPath(import.meta.url),
		`../files/${selectedDir}`
	);
	// Read files of selected directory
	let filesOfDir = fs.readdirSync(filesDirectory);

	// Add file of directory to files array
	filesOfDir.forEach((file) => {
		files.push(file);
	});
	if (files.length > 0) {
		files.push("All");
	}
}

async function askDir() {
	const answers = await inquirer.prompt({
		name: "directories",
		type: "list",
		message: "Select directory",
		choices: dirs,
	});
	selectedDir = answers.directories;
}

async function askFile() {
	const answers = await inquirer.prompt({
		name: "files",
		type: "list",
		message: "Select file to import",
		choices: files,
	});
	selectedFile = answers.files;
}

async function copyFile() {
	const importFolder = "v-imports";
	if (!fs.existsSync(importFolder)) {
		fs.mkdirSync(importFolder);
	}

	if (selectedFile === "All") {
		files.forEach((file) => {
			if (file !== "All") {
				const options = {
					targetDirectory: `${process.cwd()}/${importFolder}/${file}`,
				};

				const filesDirectory = path.resolve(
					fileURLToPath(import.meta.url),
					`../files/${selectedDir}/${file}`
				);

				copy(filesDirectory, options.targetDirectory, {
					clobber: false,
				});
			}
		});
	} else {
		const options = {
			targetDirectory: `${process.cwd()}/${importFolder}/${selectedFile}`,
		};

		const filesDirectory = path.resolve(
			fileURLToPath(import.meta.url),
			`../files/${selectedDir}/${selectedFile}`
		);

		copy(filesDirectory, options.targetDirectory, {
			clobber: false,
		});
	}
}

console.clear();

console.log(
	chalk.cyan.bold(
		figlet.textSync("VALRC", {
			horizontalLayout: "full",
			verticalLayout: "full",
		})
	)
);

await readDirectories();
await askDir();
await readFilesOfDir();
await askFile();
await copyFile();
