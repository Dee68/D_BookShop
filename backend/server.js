require('dotenv').config();
const app = require('./app');
const cors = require('cors');

require('./config/db'); // initialize DB

require('./database/init');

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});