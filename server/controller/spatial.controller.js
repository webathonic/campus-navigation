const mycon = require("../db");

const getPlotsData = async (req, res) => {
  const query =
    "SELECT name, placepageu, long,lat, ST_AsGeoJSON(geom) AS geometry, imagelink FROM data.oau_poi";

  mycon.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(400).json({ message: err.message, code: err.code });
    }
    console.log("Query Results:", results);

    console.log({ data: results.rows });

    return res.status(200).json({ data: results.rows });
  });
};

const getBuildingsData = async (req, res) => {
  const query =
    "SELECT name_of_oc, fac_dept_u, hid, ST_AsGeoJSON(geom) AS geometry FROM data.quarters_wgs84";

  mycon.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(400).json({ message: err.message, code: err.code });
    }

    console.log("Query Results:", results);

    console.log({ data: results.rows });

    return res.status(200).json({ data: results.rows });
  });

  console.log("this is get spatial data");
};

const getRoadsData = async (req, res) => {
  const query = "SELECT name, ST_AsGeoJSON(geom) AS geometry FROM data.roads";

  mycon.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(400).json({ message: err.message, code: err.code });
    }

    console.log("Query Results:", results);

    console.log({ data: results.rows });

    return res.status(200).json({ data: results.rows });
  });

  console.log("this is get spatial data");
};

module.exports = {
  getPlotsData,
  getBuildingsData,
  getRoadsData,
};
