require('dotenv').config();
const app = require('./app');
require('./config/db'); // initialize DB

require('./database/init');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});