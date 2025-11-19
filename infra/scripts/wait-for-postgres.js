const { exec } = require("node:child_process");

function checkPostgres() {
  exec(
    "docker exec postgres-development pg_isready --host localhost",
    handleReturn,
  );

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n\nPostgres está pronto e aceitando conexões!");
  }
}

process.stdout.write("\n\naguardando o postgres iniciar");
checkPostgres();
