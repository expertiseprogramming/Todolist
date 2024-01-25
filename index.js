import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

//Database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "ToDoList",
  password: "alishia5*now",
  port:5432
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

//Home Page
app.get("/", async (req, res) => {
  items = [];
  try {
    const result = await db.query("SELECT * FROM todolist");
    const lists = result.rows;
    lists.forEach((list) => {
      items.push(list);
    });

  } catch (error) {
    console.log(error)
  }
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

//Adding new List
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO todolist (title) VALUES ($1)", [item]);
    items.push({ title: item });
  } catch (error) {
    console.log(error)
  }
  res.redirect("/");
});

//Edit existing list
app.post("/edit", async (req, res) => {
  try {
    await db.query("UPDATE todolist SET title = $1 where id = $2", [req.body.updatedItemTitle, req.body.updatedItemId]);
  } catch (error) {
    console.log(error)
  }
  res.redirect("/");
});

//Delete Existing list
app.post("/delete", async (req, res) => {
  const item = req.body;
  try {
    await db.query("DELETE FROM todolist WHERE id = $1", [item.deleteItemId]);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
