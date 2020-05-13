import {logger} from "./logger";
import * as markdownit from "markdown-it";
import * as hljs from "highlight.js";
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
// markdown-it-plantuml doesn't have any typings
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mipuml = require("markdown-it-plantuml");

// markdown-it-plantuml doesn't have any typings
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mipuml = require("markdown-it-plantuml");

const initAll = async (): Promise<void> => {
  logger.info("Starting SpecDB");

  const md = markdownit({
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: "language-",
    linkify: false,
    typographer: false,
    quotes: `""''`,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (e) {
          logger.warn(`Error while running hljs: ${e.stack}`);
        }
      }
      return "";
    }
  }).use(mipuml);

  const app = express();
  const staticDir = path.join("..", "dist", "static");

  app.use(express.static(staticDir));
  app.set("view engine", "ejs");
  app.set("views", path.join("..", "dist", "views"));

  app.get("/", (req, res) => {
    res.render("pages/index.ejs", {req});
  });

  app.get("/spec/:specId", (req, res) => {
    if (fs.existsSync(path.join(".", "specs", req.params.specId + ".md")) && app.locals.specs.includes(req.params.specId)) {
      fs.readFile(path.join(".", "specs", req.params.specId + ".md"), {
        encoding: "utf8",
        flag: "r"
      }, (err, data) => {
        if (err) {
          throw err;
        }
        const html = md.render(data);
        res.render("pages/spec.ejs", {req, specId: req.params.specId, specContents: html});
      });
    } else {
      res.status(404).render("pages/404.ejs", {req});
    }
  });

  app.locals.md = md;

  const specs = fs.readdirSync(path.join(".", "specs"), {encoding: "utf8"}).filter((file) => {
    return path.extname(file).toLowerCase() === ".md";
  }).map((file) => {
    return file.substr(0, file.length-3);
  });

  app.locals.specs = specs;
  
  app.get("*", (req, res) => {
    res.status(404).render("pages/404.ejs", { req });
  });

  app.use((err: Error, req: express.Request, res: express.Response, _next: Function) => {
    if (err != null && err != undefined && err.stack != undefined) {
      logger.error(err.stack);
      res.status(500).render("pages/500.ejs", {req});
    }
  });
  
  app.use((err: Error, _req: express.Request, res: express.Response, _next: Function) => {
    if (err != null && err != undefined && err.stack != undefined) {
      logger.error(err.stack);
      res.status(500).sendFile(path.join(staticDir, "500.html"));
    }
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: Function) => {
    if (err != null && err != undefined && err.stack != undefined) {
      logger.error(err.stack);
      res.status(500).send("A serious server error has happened. Please contact the administrator of this program.");
    }
  });
  
  app.listen(8080, () => logger.info(`Server started on port 8080`));

};
initAll();