import database from "infra/database";

async function refreshDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("get - migrations endpoint", () => {
  let response;
  let body;

  beforeAll(async () => {
    await refreshDatabase();

    response = await fetch("http://localhost:3000/api/v1/migrations");
    body = await response.clone().json();
  });

  test("should return 200", () => {
    expect(response.status).toBe(200);
  });

  test("should be return an array of pending migrations", () => {
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});
