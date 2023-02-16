#!/usr/bin/env node

import fs from "fs";
import inquirer from "inquirer";
import ncp from "ncp";
import { promisify } from "util";

const copy = promisify(ncp);

let selectedDir;
let selectedFile;
let dirs = [];
let files = [];

async function readDirectories() {
	// Read directories
	dirs = fs.readdirSync("./files");
	// Capitalize first letter of each directory
	dirs = dirs.map((dir) => {
		return dir.charAt(0).toUpperCase() + dir.slice(1);
	});
}

async function readFilesOfDir() {
	// Read files of selected directory
	let filesOfDir = fs.readdirSync(`./files/${selectedDir}`);

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

				copy(`./files/${selectedDir}/${file}`, options.targetDirectory, {
					clobber: false,
				});
			}
		});
	} else {
		const options = {
			targetDirectory: `${process.cwd()}/${importFolder}/${selectedFile}`,
		};

		copy(`./files/${selectedDir}/${selectedFile}`, options.targetDirectory, {
			clobber: false,
		});
	}
}

await readDirectories();
await askDir();
await readFilesOfDir();
await askFile();
await copyFile();
