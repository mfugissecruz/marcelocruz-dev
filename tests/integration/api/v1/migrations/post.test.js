import database from "infra/database";

async function refreshDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("post - migrations endpoint", () => {
  let response;
  let body;

  beforeAll(async () => {
    await refreshDatabase();

    response = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "POST",
    });
    body = await response.clone().json();
  });

  test("should return 200", () => {
    expect(response.status).toBe(201);
  });

  test("should be return an array of pending migrations", () => {
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("migrations are be runned successfully", async () => {
    response = await fetch("http://localhost:3000/api/v1/migrations", {
      method: "POST",
    });
    body = await response.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });
});
