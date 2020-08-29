const fs = require("fs");
const path = require("path");
const dirTree = require("directory-tree");
const fastify = require("fastify")({ logger: false });
const wfreq = require("./WFreq");

// Utilities

const getConfig = () => {
  return {
    directory: "/mine/books/",
    ignoreWords: "mine/ignore.txt",
  };
};

const getFile = (filename, root = "./") => {
  try {
    return fs.readFileSync(root + filename, "utf8");
  } catch (e) {
    return undefined;
  }
};

// Routes

fastify.get("/dir", () => {
  const data = dirTree("." + getConfig().directory, {
    extensions: /\.(txt|pdf|mobi|epub)$/,
    exclude: [/.git/, /node_modules/],
  });
  return { status: "success", data: data };
});

fastify.get("/process/*", async (request) => {
  const ignoreWords = getFile(getConfig().ignoreWords);
  const file = request.params["*"];
  const query = {
    min: 1,
    ...request.query,
  };

  const freq = new wfreq();
  freq.file(file);
  freq.min(query.min);
  freq.ignore(ignoreWords.toString());

  const frequency = await freq.get().catch((error) => {
    console.log(error);
    return false;
  });

  if (!frequency) return { status: "error" };

  return { status: "success", data: frequency };
});

// Static Files

fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

// Start Server

const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
