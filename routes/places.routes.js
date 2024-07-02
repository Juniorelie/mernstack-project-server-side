const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    location: {
      lat: 40.7484445,
      lng: -73.9882393,
    },
    address: "20 W 34th St., New York, NY 10001, États-Unis",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  // console.log("GET Request in Places");
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    return res
      .status(404)
      .json({ message: "The provided id doesn't match any place" });
  }

  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return res
      .status(404)
      .json({ message: "The provided userId doesn't match any place" });
  }

  res.json({ place });
});

module.exports = router;
