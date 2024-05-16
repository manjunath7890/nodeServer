const express = require("express");
const cors = require('cors');
const expressWs = require("express-ws");
const fetch = require('node-fetch');
const router = express.Router();
expressWs(router);

router.use(cors());

require("../db doc/atlas_conn");
const User = require("../model/userSchema");
const Vehicle = require("../model/registerSchema");
const Data = require("../model/dataSchema");
const SwitchData = require("../model/inputSchema");
const Analytics = require("../model/analyticsSchema");

router.get("/", (req, res) => {
  res.send("hello router");
});

router.get('/map-api/token', async (req, res) => {
  try {
    const response = await fetch('https://outpost.mapmyindia.com/api/security/oauth/token?grant_type=client_credentials&client_id=96dHZVzsAusXufunsmHXQX3_xE8OBGDl6VenZXsIu5_TXmHzgO8Xj9RdedJCI_cDo8raZZ0Y365NdfByXGFxXA==&client_secret=lrFxI-iSEg_hu1BpgkuFEiDq75pyh7ZKFzVCynUKIsfBHyS5ODrDwFb6EllbVaCnbivb3kY7W0JKyiF3bGvqp13EgGGZuZDw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      res.json(data);

    } else {
      res.status(response.status).json({ error: 'Failed to get Map API' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getdata', (req, res) => {
  const  userName  = req.query['user'];
  Data.findOne({user: userName}).sort('-timestamp')
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: 'No data found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/postdata", async (req, res) => {
  res.json(req.body);

  try {
    if (req.body) {
      const data = new Data(req.body);
      await data.save();
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup", async (req, res) => {

  const { userName, role, email, contact, accessToken, password } = req.body;

  try {
    const newUser = await User.findOne({ email });

    if (newUser) {
      console.log("user already exist");
      return res.status(401).send({ message: "user already exist" });
    }

    const user = new User({ userName, role, contact, email, accessToken, password });

    await user.save();

    console.log("user registered successfully!");
    return res.status(200).send({ message: "user registered successfully!" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/analytics/form", async (req, res) => {
  const reportData = req.body;
  try {
    const newReport = await Analytics.findOne({ 
      'date': reportData.date, 
      'vehicleId': reportData.vehicleId 
    });
    

    if (newReport) {
      return res.status(401).send({ message: "already sent" });
    }

    const report = new Analytics(reportData);
    await report.save();

    return res.status(200).send({ message: "data sent successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.get('/analytics/data', async(req, res) => {
  const {date, vehicleId} = req.query;
  try{
    const data = await Analytics.findOne({date, vehicleId}).limit(1);
    res.json(data);
  }catch(error){
     console.log(error);
  }
});

  router.post("/register", async (req, res) => {
  const { vehicleNo, vehicleId, name, motorNo, chassiNo, batteryId, accessToken } = req.body;

  try {
    const newVehicle = await Vehicle.findOne({ vehicleId });

    if (newVehicle) {

      return res.status(401).send({ message: "vehicle already registered" });
    }

    const user = new Vehicle({ vehicleNo, vehicleId, name, motorNo, chassiNo, batteryId, accessToken });
    await user.save();

    return res.status(200).send({ message: "vechile registered successfully!" });
  } catch (err) {
    console.log(err);
  }
});

router.get('/vehicles', (req, res) => {

  Vehicle.find() 
    .then((data) => {
      if (data && data.length > 0) {
        res.json(data);
      } else {
        res.status(404).json({ error: 'No vehicles found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get('/users', (req, res) => {
  User.find() 

    .then((data) => {
      if (data && data.length > 0) {
        res.json(data);
      } else {
        res.status(404).json({ error: 'No vehicles found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get('/fleet/vehicles', (req, res) => {

  const { accessToken } = req.query; 
  if (!accessToken) {
    console.log(accessToken)
    return res.status(400).json({ error: 'accessToken not provided' });
  }


  Vehicle.find({ accessToken })
    .then((data) => {
      if (data && data.length > 0) {
        res.json(data); 

      } else {
        res.status(404).json({ error: 'No vehicles found for the provided accessToken' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {

      res.status(200).json({ message: "user logged successfully", role: user.role , userName: user.userName, accessToken: user.accessToken});
    } else {
 

      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error processing request" });
  }
});

router.post("/postinput", async (req, res) => {

  const { var1, var2 } = req.body;

  try {
    const inputdata = await SwitchData.findOne({ var2: var2 });

    if (!inputdata) {
      return res.status(404).json({ message: "Document not found" });
    }
    inputdata.var1 = var1;

    await inputdata.save();
    res.status(200).json({ message: "Document updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/api/data", async (req, res) => {
  const { fileName, userName } = req.query;
  const data = await getDocument(fileName, userName);
  res.json(data);
});

router.get("/api/brush", async (req, res) => {
  const { fileName, userName } = req.query;
  const data = await getDocument(fileName, userName);
  res.json(data);
});

router.get("/getinput", (req, res) => {
  const userName = req.query["user"];

  SwitchData.findOne({ var2: userName })
    .sort("-timestamp")
    .then((data) => {
      if (data) {
        res.json(data.var1);
      } else {
        res.status(404).json({ error: "No data found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

const getDocument = async (date, user) => {
  try {
    const data = await Data.find({ date: `${date}`, user: user }).limit(100000);
    return data;
  } catch (error) {
    console.error(error);
  }
};

router.delete('/user/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.deleteOne({ email: id });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Document deleted successfully' });
    } else {
      res.status(404).send({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting document', error });
  }
});

router.delete('/vehicle/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Vehicle.deleteOne({ vehicleId: id });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Document deleted successfully' });
    } else {
      res.status(404).send({ message: 'Document not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting document', error });
  }

});

module.exports = router;
