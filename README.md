## Palmarès de l'UNIGE (Moteur de recherche) - Search engine to verify, search for alumni of the University of Geneva.

## Node.js, Elasticsearch, Searchkit & React.

## Back-end stack for scraping the University's alumni pages: http://www.unige.ch/palmares/
Run 'backend_server/server.js' to execute the scraper at 'backend_server/routes/scrape.js' and save the student data
into backend_server/data/students.json

Stack:
- superAgent: http request library - https://github.com/visionmedia/superagent
- superAgent charset: to handle iso-8859-1 legacy pages.
- cheerio: server-side jQuery https://github.com/cheeriojs/cheerio

## Back-end stack to create an index, map, and import the student data into an Elasticsearch (ES) instance.

Run 'backend_server/elasticsearch/import.js' to import the data from the students.json file.

Stack:
- Elasticsearch: the official elasticsearch library for Node.js https://github.com/elastic/elasticsearch-js

Currently using the index settings suggested by the searchkit docs http://docs.searchkit.co/stable/server/indexing.html

## Front-end

Stack:
- Searchkit
- ReactJS (ES6)
- LESS
