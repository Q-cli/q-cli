#! /usr/bin/env node
const { program } = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");

program
  .command("create <app-name>")
  .description("create a new project")
  .option("-f --force", "overwrite target directory if it already exists")
  .action((name, options) => {
    console.log();
    figlet("WELCOME TO USE Q CLI", function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
    });
    require("../lib/create")(name, options);
  });

program.parse(process.argv);
