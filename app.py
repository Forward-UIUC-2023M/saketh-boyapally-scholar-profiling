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
