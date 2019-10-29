# Webscrapping-nodejs

A webscrapping tool built with nodejs 12.3.1 and puppeteer 1.17.0.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing and starting environment

Clone the project
```bash
$ git clone https://github.com/leo-bianchi/webscrapping-nodejs.git
```

```bash
$ cd webscrapping-nodejs
```
### Building and running container

Build Container
```bash
$ docker build -t ubuntu/node-scrapping .
```

Run Container
```bash
$ docker run -it --rm --network host ubuntu/node-scrapping
```

### API's runs at port 3000

If you are on linux, on browser type:
```bash
<<<<<<< HEAD
localhost:3000/url
=======
localhost:3000/api
>>>>>>> feature_tmp
```

Windows:
On browser type:
```
<<<<<<< HEAD
192.168.99.100:3000/url
=======
192.168.99.100:3000/api
>>>>>>> feature_tmp
```

## Authors

*   **Leonardo Bianchi** - *Initial work* - [leo-bianchi](https://github.com/leo-bianchi)

## Built With

*   [Nodejs](https://nodejs.org/en/) - The framework used. Nodeenv, by default, install the lastest nodejs version. When I build this project, nodejs was on 12.3.1 release.
*   [NPM](https://www.npmjs.com) - Dependencies Management.
*   [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Used lib for web scrapping.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
