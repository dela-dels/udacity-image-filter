import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredimage", async (req, res) => {
    let imageUrl = req.query.image_url;

    if (!imageUrl) {
      res.status(400).send("url for image was not found or is not valid");
    }

    const localImagePath = await filterImageFromURL(imageUrl);

    res.status(200).sendFile(localImagePath, function (err) {
      if (err) {
      } else {
        deleteLocalFiles([localImagePath]).then(() =>
          console.log("File was deleted: " + localImagePath)
        );
      }
    });
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
