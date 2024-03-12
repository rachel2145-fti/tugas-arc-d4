const express = require("express")
const fs = require("fs");

const app = express();

const initialDatabase = JSON.parse(fs.readFileSync('movies.json'));

process.on('exit', () => {
    fs.writeFileSync('updated_database.json', JSON.stringify(initialDatabase));
});

app.use(express.json());

app.get('/movies', (req, res) => { 
    const movieTitles = initialDatabase.map(movie => movie.Title);
    res.json(movieTitles);
});

app.get('/movies/:id', (req, res) => { 
    const movieId = req.params.id;
    const movie = initialDatabase.find(movie => movie.imdbID === movieId);
    if (!movie) { 
        return res.status(404).send( 'Maaf, yang ngoding ndak tau movienya :broken_heart:');
        }
    res.json(movie);
});

app.post('/movies', (req, res) => { 
    const { Title, Year, imdbID, Type, Poster } = req.body;
    const newMovie = { Title, Year, imdbID, Type, Poster };
    initialDatabase.push(newMovie); 
    res.status(201).json(newMovie);
});

app.delete('/movies/:id', (req, res) => { 
    const movieId = req.params.id;
    const index = initialDatabase.findIndex(movie => movie.imdbID === movieId);
    if (index === -1) { 
        return res.status(404).send('Ayo dicek lagi idnya~'); 
        };
    initialDatabase.splice(index, 1); 
    res.status(204).end();
});

app.put('/movies/:id', (req, res) => { 
    const movieId = req.params.id;
    const index = initialDatabase.findIndex(movie => movie.imdbID === movieId);
    if (index === -1) { 
        return res.status(404).send('Ayo dicek lagi idnya~'); 
        };
    initialDatabase[index] = req.body;
    res.json(initialDatabase[index]);
});

app.get('/search', (req, res) => { 
    const { title } = req.query;
    if (!title) {
        return res.status(400).send('Title parameter is missing');
    }
    console.log("test")
    const results = initialDatabase.filter(movie => movie.Title.toLowerCase().includes(title.toLowerCase()));
    console.log(results)
    res.json(results);
});

app.listen(3000);