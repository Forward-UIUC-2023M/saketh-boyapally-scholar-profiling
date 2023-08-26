# Scholar Profiling

## Overview

My branch, named 'saketh', has the necessary portions of code for running the URL scraping part of the Scholar Profiling project. 

## Setup

The requirements for running my module are the same as those for Taige Zhang's repository. https://github.com/Forward-UIUC-2023S/taige-zhang-scholar-classification

The backend portion of my code builds off of Taige's existing repository. Please use these files for reference:

scholar\src\classification\classifier.py (This file exists in Taige's repo already but I have made some modifications)

from utils import scrape_google, split_sen, get_text, multiclass

import spacy

nlp = spacy.load("en_core_web_sm")

#def clean_data(data):
    #I had an existing cleaning method here using SpaCy labels but it didn't work as intended. This is one of the places for improvement.


def scholar_search(name):
    return scrape_google(name)

def url_search(urls):
    final_dict = {}
    awd = []
    edu = []
    interest = []
    position = []

    for link in urls:
        texts = split_sen(get_text(link))
        if texts is not None:
            for t in texts:
                pred = multiclass(t)
                if pred == 0:
                    awd.append(t)
                elif pred == 1:
                    edu.append(t)
                elif pred == 2:
                    interest.append(t)
                elif pred == 3:
                    position.append(t)
        else:
            continue

    final_dict["awd"] = awd
    final_dict["edu"] = edu
    final_dict["int"] = interest
    final_dict["pos"] = position

    return final_dict

scholar\src\classification\app.py (This file is a basic Flask middleware that I added in order to host the function endpoints)

from flask import Flask, request, jsonify
from flask_cors import CORS
import classifier  

app = Flask(__name__)
CORS(app)  

@app.route("/scholar_search", methods=["POST"])
def scholar_search_endpoint():
    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"error": "Missing name in request"}), 400
    result = classifier.scholar_search(name)
    return jsonify(result)

@app.route("/url_search", methods=["POST"])
def url_search_endpoint():
    data = request.json
    urls = data.get("urls")
    if not urls:
        return jsonify({"error": "Missing urls in request"}), 400
    result = classifier.url_search(urls)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

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
