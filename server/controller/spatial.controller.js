const mycon = require("../db");

const getPlotsData = async (req, res) => {
  const query =
    "SELECT name, placepageu, long,lat, ST_AsGeoJSON(geom) AS geometry, imagelink FROM data.oau_poi";

  mycon.query(query, (err, results, fields) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(400).json({ message: err.message, code: err.code });
    }
    // console.log("Query Results:", results);

    // console.log({ data: results.rows });

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

    // console.log("Query Results:", results);

    // console.log({ data: results.rows });

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

    // console.log("Query Results:", results);

    // console.log({ data: results.rows });

    return res.status(200).json({ data: results.rows });
  });

  console.log("this is get spatial data");
};

const searchBuildingsData = async (req, res) => {
  const searchTerm = req.params.searchTerm;
  console.log({ searchTerm });
  const query = `SELECT gid, name_of_oc, fac_dept_u, hid, ST_AsGeoJSON(geom) AS geometry FROM data.quarters_wgs84 WHERE SIMILARITY(LOWER(quarters_wgs84.name_of_oc), LOWER('${searchTerm}')) > 0.3 ORDER BY gid ASC`;

  mycon.query(query, async (err, results, fields) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(400).json({ message: err.message, code: err.code });
    }

    // console.log("Query Results:", await results);

    console.log({ data: await results.rows });

    return res.status(200).json({ data: await results.rows });
  });

  console.log("this is get spatial data");
};

const getBuildingData = async (req, res) => {
  const id = req.params.id;
  console.log({ id });
  const query = `SELECT gid, name_of_oc, fac_dept_u, hid, ST_AsGeoJSON(geom) AS geometry FROM data.quarters_wgs84 WHERE gid = ${id}`;

  mycon.query(query, async (err, results, fields) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(400).json({ message: err.message, code: err.code });
    }

    // console.log("Query Results:", await results);

    console.log({ data: await results.rows });

    return res.status(200).json({ data: await results.rows });
  });

  console.log("this is get building data");
};

const getShortestRoute = async (req, res) => {
  const { startLon, startLat, endLon, endLat } = req.query;

  console.log({ startLon, startLat, endLon, endLat });

  const query = `SELECT ST_AsText(
                    ST_ClosestPoint(
                      r.geom,
                      ST_SetSRID(ST_Point(lon, lat), 4326)
                    )
                  ) AS snapped_point
                  FROM data.oau_roads r
                  ORDER BY r.geom <-> ST_SetSRID(ST_Point(lon, lat), 4326)
                  LIMIT 1;
                `;

  // [4.5209511, 7.5162813];

  const { rows } = await mycon.query(query, [
    // startLon,
    // startLat,
    4.5209511,
    7.5162813,
    endLon,
    endLat,
  ]);

  console.log({ rows });

  res.json(rows.map((r) => JSON.parse(r.geom)));
};

module.exports = {
  getPlotsData,
  getBuildingsData,
  getRoadsData,
  searchBuildingsData,
  getBuildingData,
  getShortestRoute,
};
