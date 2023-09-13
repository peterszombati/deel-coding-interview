import app from './app.ts'

init();

async function init() {
  try {
    app.listen(3001, () => {
      console.log(`Express App Listening on Port 3001

http://localhost:3001/admin/best-clients?start=2020-08-10&end=2020-09-15&limit=3
http://localhost:3001/admin/best-profession?start=2020-08-10&end=2020-09-15`);
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
