const router = require("express").Router();

const {
  getAllJobs,
  getJob,
  updateJob,
  createJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).delete(deleteJob).patch(updateJob);

module.exports = router;
