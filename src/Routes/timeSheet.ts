import { Router } from "express";
import { dbconnect } from "../dbConnection";

const router = Router();

router.get(`/getall`, async (req, res) => {
  try {
    let { user } = req as any;
    const { from, to, projectIds } = req.query; // Assuming startDate and endDate are passed as query parameters

    const projectIdsArray = projectIds?.length ? (projectIds as string).split(',').map((i) => parseInt(i)) : [];
    const placeholders = projectIdsArray.map((_: number, index : number) => `$${index + 4}`).join(',');
    
    const timesheetData: any = await dbconnect.query(
      `SELECT
          t.*,
          t.type_id AS timesheet_type_id,
          t.project_id AS timesheet_project_id,
          t.user_id AS timesheet_user_id,
          ty.name AS type_name,
          u.name AS user_name,
          p.name AS project_name
      FROM
          "Timesheet" t
      JOIN
          "Type" ty ON t.type_id = ty.id
      JOIN
          "User" u ON t.user_id = u.id
      JOIN
          "Project" p ON t.project_id = p.id
      WHERE
          u.id = $1
          AND t.date >= $2
          AND t.date <= $3
          AND t.project_id IN (${placeholders})
          `,
      [user.id, from, to, ...projectIdsArray] // Pass user ID, startDate, and endDate as query parameters
    );

    res.status(200).json(timesheetData.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`/`, async (req, res) => {
  try {
    const { user } = req as any;
    const { date, description, type_id, project_id, hours } = req.body;

    // Validate the request body data if necessary

    // Insert data into the Timesheet table
    const insertQuery = `
      INSERT INTO "Timesheet" ("date", "description", "type_id", "user_id", "project_id", "hours")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [date, description, type_id, user.id, project_id, hours];
    const result = await dbconnect.query(insertQuery, values);

    // Return the inserted data
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error while adding entry to Timesheet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;
    const { date, description, type_id, project_id, hours } = req.body;

    // Validate the request body data if necessary

    // Check if the entry exists and belongs to the authenticated user
    const checkQuery = `
      SELECT * FROM "Timesheet"
      WHERE "id" = $1 AND "user_id" = $2;
    `;
    const checkValues = [id, user.id];
    const checkResult = await dbconnect.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Entry not found or unauthorized" });
    }

    // Update the entry in the Timesheet table
    const updateQuery = `
      UPDATE "Timesheet"
      SET "date" = $1, "description" = $2, "type_id" = $3, "project_id" = $4, "hours" = $5
      WHERE "id" = $5
      RETURNING *;
    `;
    const updateValues = [date, description, type_id, project_id, id, hours];
    const result = await dbconnect.query(updateQuery, updateValues);

    // Return the updated data
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error while updating entry in Timesheet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete by Timesheet ID
router.delete(`/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req as any;

    const deleteQuery = `
      DELETE FROM "Timesheet"
      WHERE "id" = $1 AND "user_id" = $2;
    `;
    const deleteValues = [id, user.id];
    await dbconnect.query(deleteQuery, deleteValues);

    res.status(204).end();
  } catch (err) {
    console.error("Error while deleting entry from Timesheet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(`/allprojects`, async (req, res) => {
  try {
    const Query = `
      SELECT * FROM "Project";
    `;
    const projectData: any = await dbconnect.query(Query);

    res.status(200).json(projectData.rows.map((i: { id: any; name: any; }) => ({ value : i.id, label : i.name })));
  } catch (err) {
    console.error("Error while deleting entry from Timesheet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(`/alltypes`, async (req, res) => {
  try {
    const Query = `
      SELECT * FROM "Type";
    `;
    const projectData: any = await dbconnect.query(Query);

    res.status(200).json(projectData.rows.map((i: { id: any; name: any; }) => ({ value : i.id, label : i.name })));
  } catch (err) {
    console.error("Error while deleting entry from Timesheet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
