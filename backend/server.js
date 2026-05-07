require('dotenv').config();

if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
}
const app = require('./app');

require('./config/db'); // initialize DB

require('./database/init');

const PORT = process.env.PORT || 3000;




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});