import request from "supertest";
import app from "../src/index"; // Adjust the path as necessary
import { SequelizeConnection } from "../src/services/sequelize";
import Presentations from "../src/models/presentations";
import Users from "../src/models/users";
import path from "path";

describe("Presentations Controller", () => {
  let userToken: string;
  let userId: number;

  beforeAll(async () => {
    await SequelizeConnection.getInstance();
  });

  afterAll(async () => {
    await Presentations.drop();
    await Users.drop();
    await SequelizeConnection.getInstance().close();
  });

  beforeEach(async () => {
    const signupResponse = await request(app).post("/api/signup").send({
      username: "testuser",
      password: "password",
      email: "test@example.com",
    });

    const loginResponse = await request(app).post("/api/login").send({
      username: "testuser",
      password: "password",
    });

    userToken = loginResponse.body.token;
    userId = loginResponse.body.id;
  });

  describe("POST /api/createNewPresentation", () => {
    const imagePath = path.join(__dirname, "images", "test.png");

    it("should create a new presentation", async () => {
      const response = await request(app)
        .post("/api/createNewPresentation")
        .set("authorization", userToken)
        .field("presentationName", "Test Presentation")
        .field("createdBy", userId)
        .attach("thumbnail", imagePath);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Presentation created successfully!");
      expect(response.body.presentation.presentationName).toBe(
        "Test Presentation"
      );
    });

    it("should return 400 if required information is missing", async () => {
      const response = await request(app)
        .post("/api/createNewPresentation")
        .set("authorization", userToken)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Missing information!");
    });
  });

  describe("GET /api/presentations", () => {
    it("should retrieve all presentations", async () => {
      const response = await request(app)
        .get("/api/presentations")
        .set("authorization", userToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.presentations)).toBe(true);
    });

    it("should return 400 if no presentations found", async () => {
      await Presentations.destroy({ where: {} });

      const response = await request(app)
        .get("/api/presentations")
        .set("authorization", userToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Failed to retrieve presentations."
      );
    });
  });

  describe("PUT /api/presentations/:id", () => {
    it("should update a presentation name", async () => {
      const createResponse = await request(app)
        .post("/api/presentations")
        .set("authorization", userToken)
        .send({
          presentationName: "Old Presentation",
          createdBy: userId,
          thumbnail: "old.png",
        });

      const response = await request(app)
        .put(`/api/presentations/${createResponse.body.id}`)
        .set("authorization", userToken)
        .send({
          newName: "Updated Presentation",
          createdBy: userId,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Presentation name updated successfully."
      );
      expect(response.body).toHaveProperty(
        "presentationName",
        "Updated Presentation"
      );
    });

    it("should return 404 if presentation not found", async () => {
      const response = await request(app)
        .put("/api/presentations/9999")
        .set("authorization", userToken)
        .send({ newName: "Non-existent Presentation" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Presentation not found");
    });
  });

  describe("DELETE /api/presentations/:id", () => {
    it("should delete a presentation", async () => {
      const imagePath = path.join(__dirname, "images", "delete.png");
      const createResponse = await request(app)
        .post("/api/presentations")
        .set("authorization", userToken)
        .send({
          presentationName: "Presentation to Delete",
          createdBy: userId,
          thumbnail: imagePath,
        });

      const response = await request(app)
        .delete(`/api/presentations/${createResponse.body.id}`)
        .set("authorization", userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Presentation and file deleted successfully."
      );
    });

    it("should return 404 if presentation not found for deletion", async () => {
      const response = await request(app)
        .delete("/api/presentations/9999")
        .set("authorization", userToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Presentation not found");
    });
  });
});
