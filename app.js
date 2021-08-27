const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;
app.use(cors());
app.use(bodyParser.json());

const listScheme = new Schema({
  text: String,
  number: Number,
  date: String
});
const url = "mongodb+srv://RomanS:testserver1@cluster0.350pg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const List = mongoose.model("lists", listScheme);
app.get('/allLists', (req, res) => {
  List.find().then(result => {
    res.send({ data: result });
  });
});
app.post('/createList', (req, res) => {
  const list = new List(req.body);
  if (req.body.hasOwnProperty('text')
    && req.body.hasOwnProperty('number')
    && req.body.text && req.body.number) {
      list.save().then(result => {
        List.find().then(result => {
        res.send({ data: result });
      });
    });
  } else {
    res.status(422).send(`Error! Please fill in the fields in full`);
  }
});
app.patch('/updateList', (req, res) => {
  const body = req.body;
  if (body.hasOwnProperty('_id')
    && (body.hasOwnProperty('text') || body.hasOwnProperty('number'))) {
      List.updateOne({ _id: req.body._id }, req.body).then(result => {
        List.find().then(result => {
        res.send({ data: result });
      });
    }).catch(err => res.status(404).send(`Error! Sorry, but no such object with this id was found`));
  } else {
    res.status(422).send(`Error! Please fill in the fields in full`);
  };
});
app.delete('/deleteList', (req, res) => {
  if (req.query._id) {
    List.deleteOne({ _id: req.query._id }).then(result => {
      List.find().then(result => {
        res.send({ data: result });
      });
    }).catch(err => res.status(404).send(`Error! Sorry, but no such object with this id was found`));
  } else {
    res.status(422).send(`Error! Sorry, but no such object with this id was found`);
  };
});
app.delete('/deleteAllList', (req, res) => {
  List.remove().then(() => {
    List.find().then(result => {
      res.send({ data: result });
    });
  });
});
app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});
