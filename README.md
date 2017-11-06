## http://www.unige.info - Palmarès de l'UNIGE (Moteur de recherche)

Web service and Elasticsearch API to verify in real-time if an alumni's self-reported degree obtained from the University of Geneva is genuine.

Its main application is against **degree fraud**.

If a graduate is not listed in our database, either:
- That person graduated before March 1999.
- The person may have studied at the University of Geneva, but never graduated.
- In the rare chance, there may be an omission from the official graduate list publication.

For API access to the elasticsearch instance, please message me directly.

This is an unofficial verification system, this project is not supported by the University of Geneva. A person's degree can be double-checked in the (non-searchable) official publication: http://www.unige.ch/palmares/

### Tech stack: Node.js, Elasticsearch, Searchkit & React.

## Back-end with Node.js to scrape the University's alumni pages: http://www.unige.ch/palmares/
Run 'backend_server/server.js' to execute the [scraper](https://github.com/tannera/palmares_unige/blob/master/backend_server/routes/scrape.js) and save the student data
into backend_server/data/students.json

The scraper handles the changing DOM structure between the different years.

Stack:
- superAgent: http request library - https://github.com/visionmedia/superagent
- superAgent-charset: to handle iso-8859-1 legacy pages.
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


