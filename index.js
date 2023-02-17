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
import { createSpinner } from "nanospinner";

function delay(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

const copy = promisify(ncp);

let config = {};

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
	const importFolder = config.importFolder;
	if (!fs.existsSync(importFolder)) {
		fs.mkdirSync(importFolder);
	}

	if (selectedFile === "All") {
		files.forEach(async (file) => {
			if (file !== "All") {
				const options = {
					targetDirectory: `${process.cwd()}/${importFolder}/${file}`,
				};

				const filesDirectory = path.resolve(
					fileURLToPath(import.meta.url),
					`../files/${selectedDir}/${file}`
				);

				const copySpinner = createSpinner(`Importing ${file}`).start();
				await copy(filesDirectory, options.targetDirectory, {
					clobber: false,
				});
				copySpinner.success({
					text: `Imported ${chalk.cyan(file)} to ${chalk.cyan(
						options.targetDirectory
					)}`,
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

		const copySpinner = createSpinner(`Importing ${selectedFile}`).start();
		await copy(filesDirectory, options.targetDirectory, {
			clobber: false,
		});
		copySpinner.success({
			text: `Imported ${chalk.cyan(selectedFile)} to ${chalk.cyan(
				options.targetDirectory
			)}`,
		});
	}
}

async function checkConfigFile() {
	const configSpinnerCheck = createSpinner("Checking config file...");
	configSpinnerCheck.start();

	const configFile = path.resolve(
		fileURLToPath(import.meta.url),
		"../valrc.config.json"
	);

	if (!fs.existsSync(configFile)) {
		configSpinnerCheck.warn({ text: "Config file not found" });

		// create config file
		const configSpinnerCreate = createSpinner("Creating config file...");
		configSpinnerCreate.start();

		const pathDir = path.resolve(
			fileURLToPath(import.meta.url),
			`../default.config.json`
		);

		await copy(pathDir, `${process.cwd()}/valrc.config.json`, {
			clobber: false,
		});

		configSpinnerCreate.success({ text: "Config file created" });
	} else {
		configSpinnerCheck.success({ text: "Config found!" });
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

await checkConfigFile().then(async () => {
	config = JSON.parse(
		await readFile(
			path.resolve(fileURLToPath(import.meta.url), `../valrc.config.json`)
		)
	);
	await readDirectories();
	await askDir();
	await readFilesOfDir();
	await askFile();
	await copyFile();
});
