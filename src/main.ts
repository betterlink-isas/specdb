import {logger} from "./logger";
import * as markdownit from "markdown-it";
import * as hljs from "highlight.js";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as fs from "fs";

const initAll = async (): Promise<void> => {
  logger.info("Starting SpecDB");

  const md = markdownit({
    html: false,
    xhtmlOut: false,
    breaks: true,
    langPrefix: "language-",
    linkify: false,
    typographer: false,
    quotes: "\"\"\'\'",
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }

      return "";
    }
  });

  const app = express();
  const staticDir = path.join("..", "dist", "static");

  app.use(express.static(staticDir));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("view engine", "ejs");
  app.set("views", path.join("..", "dist", "views"));

  app.get("/", (req, res) => {
    res.render("pages/index.ejs", {req});
  });

  app.get("/spec/:specId", (req, res) => {
    if (fs.existsSync(path.join(".", "specs", req.params.specId + ".md"))) {
      const file = fs.readFileSync(path.join(".", "specs", req.params.specId + ".md"), {
        encoding: "utf8",
        flag: "r"
      });
      const html = md.render(file);
      res.render("pages/spec.ejs", {req, specId: req.params.specId, specContents: html});
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, req: express.Request, res: express.Response, next: Function) => {
    if (err != null && err != undefined && err.stack != undefined) {
      logger.error(err.stack);
      res.status(500).render("pages/500.ejs", {req});
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: express.Request, res: express.Response, next: Function) => {
    if (err != null && err != undefined && err.stack != undefined) {
      logger.error(err.stack);
      res.status(500).sendFile(path.join(staticDir, "500.html"));
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: express.Request, res: express.Response, next: Function) => {
    if (err != null && err != undefined && err.stack != undefined) {
      logger.error(err.stack);
      res.status(500).send("A serious server error has happened. Please contact The Puzzlemaker (tpzker@thepuzzlemaker.info)");
    }
  });
  
  app.listen(8080, () => logger.info(`Server started on port 8080`));

};
initAll();