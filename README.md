# Scholar Profiling

## Overview

My branch, named 'saketh', has the necessary portions of code for running the URL scraping part of the Scholar Profiling project. 

## Setup

The requirements for running my module are the same as those for Taige Zhang's repository. https://github.com/Forward-UIUC-2023S/taige-zhang-scholar-classification

The backend portion of my code builds off of Taige's existing repository. Please use these files for reference:

scholar\src\classification\classifier.py (This file exists in Taige's repo already but I have made some modifications)

scholar\src\classification\app.py (This file is a basic Flask middleware that I added in order to host the function endpoints)

Replace classifier.py file in Taige's repository with the one that I have provided and add the app.py file as well.

## Running Instrucions

To start the server:
* cd into start_web
* cd into server
* npm run dev

To start the web app in localhost:
* cd into start_web
* cd into client
* npm start

To start the Flask app:
* cd into the classification folder
* python app.py

## Demo video

https://drive.google.com/drive/u/1/folders/1CgzOD4gIwfyrVz3_UiB5ChfI1Vm4yCve

## Issues and Future Work

* Issues with accuracy of classification. 
* Excess noise is present in the result as well.
* Add cleaning step after output from model or fine-tune model
* Alternatively can use a different model/web scraping method instead of Taige's repo
